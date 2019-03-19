package com.liunix.complete3;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeMirror;
import javax.lang.model.util.Types;

import com.sun.source.tree.ErroneousTree;
import com.sun.source.tree.Scope;
import com.sun.source.tree.Tree;
import com.sun.source.util.SourcePositions;
import com.sun.source.util.TreePath;
import com.sun.source.util.TreePathScanner;
import com.sun.source.util.Trees;

public class CompilerService {

    private static final Logger LOG = Logger.getLogger("CompilerService");

    private Cache cache;

    private void recompile(URI file, String contents, int line, int character) {
        if (cache == null || !cache.file.equals(file) || !cache.contents.equals(contents) || cache.line != line
                || cache.character != character) {
            cache = new Cache(file, contents, line, character);
        }
    }

    private TreePath path(URI file, int line, int character) {
        Trees trees = Trees.instance(cache.task);
        SourcePositions pos = trees.getSourcePositions();
        long cursor = cache.root.getLineMap().getPosition(line, character);

        // Search for the smallest element that encompasses line:column
        class FindSmallest extends TreePathScanner<Void, Void> {
            TreePath found = null;

            boolean containsCursor(Tree tree) {
                long start = pos.getStartPosition(cache.root, tree), end = pos.getEndPosition(cache.root, tree);
                // If element has no position, give up
                if (start == -1 || end == -1)
                    return false;
                // Check if `tree` contains line:column
                return start <= cursor && cursor <= end;
            }

            @Override
            public Void scan(Tree tree, Void nothing) {
                // This is pre-order traversal, so the deepest element will be the last one
                // remaining in `found`
                if (containsCursor(tree))
                    found = new TreePath(getCurrentPath(), tree);
                super.scan(tree, nothing);
                return null;
            }

            @Override
            public Void visitErroneous(ErroneousTree node, Void nothing) {
                for (Tree t : node.getErrorTrees()) {
                    scan(t, nothing);
                }
                return null;
            }

            TreePath find(Tree root) {
                scan(root, null);
                if (found == null) {
                    String message = String.format("No TreePath to %s %d:%d", file, line, character);
                    throw new RuntimeException(message);
                }
                return found;
            }
        }
        return new FindSmallest().find(cache.root);
    }

    //1. 找到光标所在元素
    public Element element(URI file, String contents, int line, int character) {
        recompile(file, contents, line, character);

        Trees trees = Trees.instance(cache.task);
        TreePath path = path(file, line, character);
        return trees.getElement(path);
    }

    //2. 找到嵌套范围内的元素
    public List<Element> scopeMembers(URI file, String contents, int line, int character) {
        recompile(file, contents, line, character);

        Trees trees = Trees.instance(cache.task);
        Types types = cache.task.getTypes();
        TreePath path = path(file, line, character);
        Scope start = trees.getScope(path);

        class Walk {
            List<Element> result = new ArrayList<>();

            boolean isStatic(Scope s) {
                ExecutableElement method = s.getEnclosingMethod();
                if (method != null) {
                    return method.getModifiers().contains(Modifier.STATIC);
                } else
                    return false;
            }

            boolean isStatic(Element e) {
                return e.getModifiers().contains(Modifier.STATIC);
            }

            boolean isThisOrSuper(VariableElement ve) {
                String name = ve.getSimpleName().toString();
                return name.equals("this") || name.equals("super");
            }

            // Place each member of `this` or `super` directly into `results`
            void unwrapThisSuper(VariableElement ve) {
                TypeMirror thisType = ve.asType();
                // `this` and `super` should always be instances of DeclaredType, which we'll
                // use to check accessibility
                if (!(thisType instanceof DeclaredType)) {
                    LOG.warning(String.format("%s is not a DeclaredType", thisType));
                    return;
                }
                DeclaredType thisDeclaredType = (DeclaredType) thisType;
                Element thisElement = types.asElement(thisDeclaredType);
                for (Element thisMember : thisElement.getEnclosedElements()) {
                    if (isStatic(start) && !isStatic(thisMember))
                        continue;
                    if (thisMember.getSimpleName().contentEquals("<init>"))
                        continue;

                    // Check if member is accessible from original scope
                    if (trees.isAccessible(start, thisMember, thisDeclaredType)) {
                        result.add(thisMember);
                    }
                }
            }

            // Place each member of `s` into results, and unwrap `this` and `super`
            void walkLocals(Scope s) {
                for (Element e : s.getLocalElements()) {
                    if (e instanceof TypeElement) {
                        TypeElement te = (TypeElement) e;
                        if (trees.isAccessible(start, te))
                            result.add(te);
                    } else if (e instanceof VariableElement) {
                        VariableElement ve = (VariableElement) e;
                        if (isThisOrSuper(ve)) {
                            unwrapThisSuper(ve);
                            if (!isStatic(s))
                                result.add(ve);
                        } else {
                            result.add(ve);
                        }
                    } else {
                        result.add(e);
                    }
                }
            }

            // Walk each enclosing scope, placing its members into `results`
            List<Element> walkScopes() {
                for (Scope s = start; s != null; s = s.getEnclosingScope()) {
                    walkLocals(s);
                }

                return result;
            }
        }
        return new Walk().walkScopes();
    }       
    
    

}