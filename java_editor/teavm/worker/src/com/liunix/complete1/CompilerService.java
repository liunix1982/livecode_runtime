package com.liunix.complete1;

import javax.lang.model.element.Element;

import com.sun.source.tree.ErroneousTree;
import com.sun.source.tree.Tree;
import com.sun.source.util.SourcePositions;
import com.sun.source.util.TreePath;
import com.sun.source.util.TreePathScanner;
import com.sun.source.util.Trees;
import com.sun.tools.javac.api.JavacTrees;

public class CompilerService {

    private Cache cache;

    private void recompile(String file, String contents, int line, int character) {
        //这里也出个小错length的
        // if (cache == null || !cache.file.equals(file) || !cache.contents.equals(contents) || cache.line != line
        //         || cache.character != character) {
        //     cache = new Cache(file, contents, line, character);
        // }

        cache = new Cache(file, contents, line, character);
    }

    private TreePath path(String file, int line, int character) {
        Trees trees = Trees.instance(cache.task);
        System.out.println(JavacTrees.class.toString());
        System.out.println(JavacTrees.class.getDeclaredMethods());


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
    public Element element(String file, String contents, int line, int character) {
        recompile(file, contents, line, character);

        Trees trees = Trees.instance(cache.task);
        TreePath path = path(file, line, character);
        return trees.getElement(path);
    }

}