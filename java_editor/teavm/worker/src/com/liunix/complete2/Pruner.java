package com.liunix.complete2;

import java.io.IOException;
import java.nio.charset.Charset;

import javax.tools.JavaCompiler;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

import com.sun.source.tree.BlockTree;
import com.sun.source.tree.CompilationUnitTree;
import com.sun.source.tree.ErroneousTree;
import com.sun.source.tree.LineMap;
import com.sun.source.tree.StatementTree;
import com.sun.source.tree.Tree;
import com.sun.source.util.JavacTask;
import com.sun.source.util.SourcePositions;
import com.sun.source.util.TreeScanner;
import com.sun.source.util.Trees;
import com.sun.tools.javac.api.JavacTrees;

class Pruner {
    // private static final Logger LOG = Logger.getLogger("main");
    // Parse-only compiler
    // TODO this should come from Parser
    // private static final JavaCompiler COMPILER =
    // ServiceLoader.load(JavaCompiler.class).iterator().next();
    private static final JavaCompiler COMPILER = ToolProvider.getSystemJavaCompiler();
    private static final StandardJavaFileManager FILE_MANAGER = COMPILER.getStandardFileManager(null, null,Charset.defaultCharset());

    // private static void report(Diagnostic<? extends JavaFileObject> diags) {
    //     LOG.warning(diags.getMessage(null));
    // }

    //TODO:这里也要去除URI
    // private static JavacTask singleFileTask(String file, String contents) {
    //     // return (JavacTask) COMPILER.getTask(null, FILE_MANAGER, null, Arrays.asList("-proc:none", "-g"),
    //     //         Collections.emptyList(), Collections.singletonList(new StringFileObject(contents, file)));

    //     return new SingleFileTask().buildTask(file, contents);
    // }

    private final JavacTask task;
    private final CompilationUnitTree root;
    private final StringBuilder contents;

    Pruner(String file, String contents) {
        System.out.println("======================================Pruner.1");
        this.task = SingleFileTask.buildTask(file, contents);
        try {
            System.out.println("======================================Pruner.1.1");
            this.root = task.parse().iterator().next();
            System.out.println("======================================Pruner.1.2");
        } catch (IOException e) {
            System.out.println("pruner出异常了");
            throw new RuntimeException(e);
        }
        this.contents = new StringBuilder(contents);
        System.out.println("======================================Pruner.2");
    }

    void prune(int line, int character) {
        //强型引入个类看看
        // System.out.println(JavacTrees.class.toString());
        // System.out.println(JavacTrees.class.getDeclaredMethods());
        System.out.println("======================================Pruner.2.1");
        //TODO： 下面这行代码底层过不去!!!!!!
        SourcePositions sourcePositions = Trees.instance(task).getSourcePositions();
        System.out.println("======================================Pruner.3");
        LineMap lines = root.getLineMap();
        long cursor = lines.getPosition(line, character);

        class Scan extends TreeScanner<Void, Void> {
            boolean erasedAfterCursor = false;

            boolean containsCursor(Tree node) {
                long start = sourcePositions.getStartPosition(root, node),
                        end = sourcePositions.getEndPosition(root, node);
                return start <= cursor && cursor <= end;
            }

            void erase(long start, long end) {
                for (int i = (int) start; i < end; i++) {
                    switch (contents.charAt(i)) {
                    case '\r':
                    case '\n':
                        break;
                    default:
                        contents.setCharAt(i, ' ');
                    }
                }
            }

            @Override
            public Void visitBlock(BlockTree node, Void aVoid) {
                if (containsCursor(node)) {
                    super.visitBlock(node, aVoid);
                    // When we find the deepest block that includes the cursor
                    if (!erasedAfterCursor) {
                        long start = cursor;
                        long end = sourcePositions.getEndPosition(root, node);
                        // Find the next line
                        while (start < end && contents.charAt((int) start) != '\n')
                            start++;
                        // Find the end of the block
                        while (end > start && contents.charAt((int) end) != '}')
                            end--;
                        // Erase from next line to end of block
                        erase(start, end - 1);
                        erasedAfterCursor = true;
                    }
                } else if (!node.getStatements().isEmpty()) {
                    StatementTree first = node.getStatements().get(0);
                    StatementTree last = node.getStatements().get(node.getStatements().size() - 1);
                    long start = sourcePositions.getStartPosition(root, first);
                    long end = sourcePositions.getEndPosition(root, last);
                    erase(start, end);
                }
                return null;
            }

            @Override
            public Void visitErroneous(ErroneousTree node, Void nothing) {
                return super.scan(node.getErrorTrees(), nothing);
            }
        }

        new Scan().scan(root, null);
    }

    String contents() {
        return contents.toString();
    }
}