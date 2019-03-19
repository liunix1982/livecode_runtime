package com.liunix.complete2;

import java.io.IOException;

import com.sun.source.tree.CompilationUnitTree;
import com.sun.source.util.JavacTask;

public class Cache {
    private final String contents;
    private final String file;
    private final CompilationUnitTree root;
    final JavacTask task;
    private final int line, character;

    Cache(String file, String contents, int line, int character) {
        System.out.println("======================================Chache.1");
        // If `line` is -1, recompile the entire file
        if (line == -1) {
            this.contents = contents;
        }
        // Otherwise, focus on the block surrounding line:character,
        // erasing all other block bodies and everything after the cursor in its own
        // block
        else {
            Pruner p = new Pruner(file, contents);
            System.out.println("======================================Chache.2");
            p.prune(line, character); 
            System.out.println("======================================Chache.3");
            this.contents = p.contents();
            System.out.println("======================================Chache.4");
        }
        this.file = file;
        this.task = SingleFileTask.buildTask(file, this.contents);
        System.out.println("======================================Chache.5");
        try {
            //这里出的错
            this.root = task.parse().iterator().next();
            System.out.println("======================================Chache.6");
            // The results of task.analyze() are unreliable when errors are present
            // You can get at `Element` values using `Trees`
            task.analyze();
            System.out.println("======================================Chache.7");
        } catch (IOException e) {
            System.out.println("======================================Chache.8:"+e);
            throw new RuntimeException(e);
        }
        this.line = line;
        this.character = character;
    }
}