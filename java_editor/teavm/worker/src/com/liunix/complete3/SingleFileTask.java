package com.liunix.complete3;

import java.net.URI;
import java.util.Collections;

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
    public JavacTask buildTask(URI filePath,String content){
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        StandardJavaFileManager manager = compiler.getStandardFileManager(null, null, null);
        DiagnosticCollector<JavaFileObject> diagnosticCollector = new DiagnosticCollector<>();
        JavacTask task = (JavacTask)compiler.getTask(null, manager, diagnosticCollector, null, null, Collections.singletonList(new StringFileObject(content, filePath)));
        return task;
    }
    
}