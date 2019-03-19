package com.liunix.complete1;

import java.io.File;
import java.util.Arrays;

import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

import com.sun.source.util.JavacTask;

/**
 * SingleFileTask
 */
public class SingleFileTask {

    //TODO: content暂时不用
    public JavacTask buildTask(String filePath,String content){
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        StandardJavaFileManager manager = compiler.getStandardFileManager(null, null, null);
        File file = new File(filePath.toString());
        Iterable<? extends JavaFileObject> sources = manager.getJavaFileObjectsFromFiles(Arrays.asList(file));

//        DiagnosticCollector<JavaFileObject> diagnosticCollector = new DiagnosticCollector<>();
        JavacTask task = (JavacTask)compiler.getTask(null, manager, null, Arrays.asList("-proc:none", "-g","-Xbootclasspath/p:/home/liunix/" +
                ".m2/repository/com/google/errorprone/javac/1.8.0-u20/javac-1.8.0-u20.jar"), null, sources);
        return task;
    }
    
}