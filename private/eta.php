<?php

/**
 * eta.php
 * 
 * Eta is a lightweight and transparent templating engine designed for prototypes and small web applications.
 * The symbol for the Greek capital letter eta is H. Eta is often used in math as the symbol for efficiency.
 * 
 * ~ INSTALLATION ~
 * Copy this file into a directory of your choosing and add the require_once to the file that is using Eta.
 * The default directory for Eta is ./ , but may be changed via H::setHome().
 * The default page template for Eta is ./base.view , but this may be changed via H::setBase().
 * 
 * @usage
 * echo H::render(null, [
 *     "someData" => $myData
 * ]);
 * 
 * @author Dan Cobb
 * @see http://proccli.com/2010/03/dead-simple-php-template-rendering/
 * @see //www.github.com/cobbdb/eta
 * @version 2.0.2
 */

class MissingTemplateException extends Exception {
}

class H {
    /** Current views directory. */
    private static $home = "./";
    /** Default views directory. */
    private static $defaultHome = "./";
    /** Current base page template. */
    private static $base = "./base.view";
    
    /**
     * Reset Eta back to default home directory and base template.
     */
    public static function reset() {
        self::$home = self::$defaultHome;
        self::$base = self::$home . "base.view";
    }
    
    /**
     * Set a new default views directory.
     * @param {String} path
     * @param {Boolean} [remember] True to retain this as the default directory.
     */
    public static function setHome($path, $remember = false) {
        self::$home = $path;
        if ($remember) {
            self::$defaultHome = $path;
        }
    }
    
    /**
     * Set a new default base page template.
     * @param {String} path Complete path to new base template.
     */
    public static function setBase($path) {
        self::$base = $path;
    }
    
    /**
     * Render a template without auto-responding.
     * @param {String} path Filename of the template to render.
     * @param {Array} [model] Data to inject into the template.
     * @param {Boolean} [grounded] False to use a literal path and bypass the home directory.
     * @returns {String}
     * @throws {MissingTemplateException}
     */
    public static function render($path, $model = Array(), $grounded = true) {
        if (!isset($path)) {
            $path = self::$base;
        } else if ($grounded) {
            $path = self::$home . $path;
        }
        
        if (file_exists($path)) {
            ob_start();
            extract($model);
            @include $path;
            return ob_get_clean();
        } else {
            throw new MissingTemplateException("Template: $path could not be found!");
        }
    }
}
