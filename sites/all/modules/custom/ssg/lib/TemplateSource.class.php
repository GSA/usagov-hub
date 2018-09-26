<?php

namespace ctac\ssg;

class TemplateSource
{
    public $ssg;

    public $sourceDir;
    public $sourceTemplateDir;
    public $sourceAssetDir;
    public $sourceStaticDir;

    public $destTemplateDir;
    public $destAssetDir;
    public $destStaticDir;

    public $freshTemplates;

    public function __construct( &$ssg )
    {
        $this->ssg = &$ssg;

        $repoTemplateDir = $this->ssg->config['templateSync']['repo_template_dir'];
        $repoTemplateDir = preg_replace('(^[\.\/]|[\.\/]$)','',$repoTemplateDir);

        $this->sourceDir         = $this->ssg->config['tempDir'].'/webtemplates';
        $this->sourceTemplateDir = $this->sourceDir.'/'.$repoTemplateDir;
        $this->sourceAssetDir    = $this->sourceDir.'/assets';
        $this->sourceStaticDir   = $this->sourceDir.'/staticroot';

        $this->destDir           = $this->ssg->config['permDir'];
        $this->destTemplateDir   = $this->destDir.'/templates/twig/'.$repoTemplateDir;
        $this->destAssetDir      = $this->destDir.'/templates/assets/';
        $this->destStaticDir     = $this->destDir.'/templates/staticroot/';

        $this->freshTemplates     = false;

    }

    public function sync()
    {
        $this->ssg->log("Templates: preparing directories ... ");

        $this->ssg->prepareDir($this->sourceDir);
        // $this->ssg->prepareDir($this->sourceTemplateDir);
        // $this->ssg->prepareDir($this->sourceAssetDir);
        // $this->ssg->prepareDir($this->sourceStaticDir);

        $this->ssg->prepareDir($this->destDir);
        $this->ssg->prepareDir($this->destTemplateDir);
        $this->ssg->prepareDir($this->destAssetDir);
        $this->ssg->prepareDir($this->destStaticDir);

        $this->ssg->log("done\n");

        /// if we already have compiled templates
        /// and cached assets+docroot, the we are done
        // if ( $this->verifySource() && $this->verifyDestination() && !$this->freshTemplates )
        // {
        //     /// if we have not been told to refresh anything
        //     /// we are ready to go
        //     $this->ssg->log("Templates: using existing templates\n");
        //     $this->mergeSourceIntoDestination();
        //     return true;
        // }

        if ( !$this->sourceRepoExists() )
        { 
            $this->cloneRepo();
            $this->pullSourceRepo();
        } else if ( $this->freshTemplates ) {

            $this->pullSourceRepo();
        // } else {
        //     $this->checkoutBranch();
        }

        /// even if source is bad, we might have a local copy  of templates to use
        // if ( !$this->verifySource() )
        // {
        //     return false;
        // }

        /// should template object operate straight outa source
        /// or be merged into a diff location before compilation
        /// theoretically, a version of the templates from git
        /// could be checked into the ssg repo in case there was 
        /// no git access
        $this->mergeSourceIntoDestination();

        return $this->verifyDestination();
    }

    public function cloneRepo()
    {
        $this->ssg->log("Templates: cleanup up environment ... \n");
        if ( !empty($this->sourceDir) && $this->sourceDir !== '/' )
        {
            $remove_cmd = "rm -rf {$this->sourceDir}";
            // $this->ssg->log($remove_cmd."\n");
            $rslt = `{$remove_cmd} 2>&1`;
        }

        $this->ssg->log("Templates: cloning source repo ... \n");
        /// grab data from source repo
        $git_repo = 'https://'.urlencode($this->ssg->config['templateSync']['repo_user'])
                .':'.urlencode($this->ssg->config['templateSync']['repo_pass'])
                .'@'.$this->ssg->config['templateSync']['repo_url'];
        
        $clone_cmd = "git clone '{$git_repo}' {$this->sourceDir}";
        // $this->ssg->log($clone_cmd."\n");
        $rslt = `{$clone_cmd} 2>&1`;
        // $this->ssg->log($rslt."\n");

        if ( strpos($rslt, 'Authentication failed') !== false ) {
            $this->ssg->log("Error - Could not pull from source-repository due to authentication-error.\n");
            return false;
        }

        if ( strpos($rslt, 'not found') !== false ) {
            $this->ssg->log("Error - Could not find source-repository\n");
            return false;
        }

        if ( strpos($rslt, 'fatal:') !== false ) {
            $this->ssg->log("Error - $rslt\n");
            return false;
        }

        return true;
    }

    public function checkoutBranch()
    {
        $this->ssg->log("Templates: switch source repo branch ... \n");
        $branch_cmd = "cd {$this->sourceDir}"
                     ." && git checkout {$this->ssg->config['templateSync']['repo_branch']}";
        $rslt = `{$branch_cmd} 2>&1 >/dev/null`;
        if ( strpos($rslt, 'error') === 0 ) {
            $this->ssg->log("Error - Could not switch to branch \"{$this->ssg->config['templateSync']['repo_branch']}\" in source-repo.\n");
            return false;
        }
    }

    public function pullSourceRepo()
    {
        $this->ssg->log("Templates: refreshing current templates ... \n");
        $update_cmd = "cd {$this->sourceDir}"
                     ." && git checkout {$this->ssg->config['templateSync']['repo_branch']}" // 2>&1 >/dev/null
                     ." && git pull";
        $rslt = `{$update_cmd} 2>&1 >/dev/null`;
        if ( strpos($rslt, 'error') === 0 ) {
            $this->ssg->log("Error - Could not pull \"{$this->ssg->config['templateSync']['repo_branch']}\" from source-repo.\n");
            return false;
        }

        return true;
    }

    public function mergeSourceIntoDestination()
    {
        if ( is_dir($this->sourceTemplateDir) )
        {
            $this->ssg->prepareDir($this->destTemplateDir);
            if ( !is_writable($this->destTemplateDir) )
            {
                $this->ssg->chmod_recurse($this->destTemplateDir,0744);
            }
            $this->ssg->copy_recurse( $this->sourceTemplateDir, $this->destTemplateDir );
        }
        if ( is_dir($this->sourceStaticDir) )
        {
            $this->ssg->prepareDir($this->destStaticDir);
            if ( !is_writable($this->destStaticDir) )
            {
                $this->ssg->chmod_recurse($this->destStaticDir,0744);
            }
            $this->ssg->copy_recurse( $this->sourceStaticDir,   $this->destStaticDir   );
        }

        /// Asset Dirs
        $asset_dirs = [ 'js', 'css', 'fonts', 'images' ];
        foreach ( $asset_dirs as $dir )
        {
            $sourceAssetDir = "{$this->sourceAssetDir}/{$dir}";
            $destAssetDir   = "{$this->destAssetDir}/{$dir}";

            // $this->ssg->prepareDir($sourceAssetDir);
            // if ( !is_readable($sourceAssetDir) )
            // {
            if ( !is_dir($this->sourceAssetDir) || !is_readable($sourceAssetDir) )
            {
                $this->ssg->log("Template Merge: error, source not readable: $sourceAssetDir\n");
                continue;
            }
            // $this->ssg->log("Template Merge: $sourceAssetDir >> $destAssetDir\n");

            $this->ssg->prepareDir($destAssetDir);
            if ( !is_writable($destAssetDir) )
            {
                $this->ssg->chmod_recurse($destAssetDir,0744);
            }
            $this->ssg->copy_recurse($sourceAssetDir,$destAssetDir);
        }
    }

    public function sourceRepoExists()
    {
        if ( !is_dir($this->sourceDir) ) {
            // $this->ssg->log("Template Sync: can't find source repo dir: {$this->sourceDir}\n");
            return false;
        }
        if ( !is_dir($this->sourceDir.'/.git') ) {
            // $this->ssg->log("Template Sync: source repo dir is not a git repo: {$this->sourceDir}/.git\n");
            return false;
        }
        return true;
    }

    public function verifySource()
    {
        if ( !is_dir($this->sourceAssetDir) ) {
            $this->ssg->log("Template Sync: can't find template asset dir: {$this->sourceAssetDir}\n");
            return false;
        }

        // if ( !is_dir($this->sourceStaticDir) ) {
        //     $this->ssg->log("Template Sync: can't find template static dir: {$this->sourceStaticDir}\n");
        //     return false;
        // }

        foreach ( $this->ssg->pageTypes as $type )
        {
            $template_file = "{$this->sourceTemplateDir}/{$type}.twig";
            if ( !file_exists($template_file) )
            {
                // $this->ssg->log("Template Sync: verify local: can't find template for $type: $template_file");
                return false;
            }
        }
        return true;
    }

    public function verifyDestination()
    {
        if ( !is_dir($this->destAssetDir) ) {
            $this->ssg->log("Template Sync: can't find template asset dir: {$this->destAssetDir}");
            return false;
        }

        if ( !is_dir($this->destStaticDir) ) {
            $this->ssg->log("Template Sync: can't find template static dir: {$this->destStaticDir}");
            /// not worth dying for
            // return false;
        }
        foreach ( $this->ssg->pageTypes as $type )
        {
            $template_file = "{$this->destTemplateDir}/{$type}.twig";
            $this->ssg->log("Verifying Template: {$type}.twig\n");
            if ( !file_exists($template_file) )
            {
                $this->ssg->log("Template Sync: verify local: can't find template for $type: $template_file");
                return false;
            }
        }
        return true;
    }

}