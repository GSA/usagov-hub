<?php

namespace ctac\ssg;

class TemplateSource
{
    use LoggingTrait;
    use DirectoryTrait;

    public $ssg;

    public $sourceDir;
    public $sourceTemplateDir;
    public $sourceAssetDir;
    public $sourceStaticDir;

    // public $destTemplateDir;
    public $destAssetDir;
    public $destStaticDir;

    public $freshTemplates;
    public $updateTemplates;

    public function __construct( &$ssg )
    {
        $this->ssg = &$ssg;

        $repoBaseDir = strtolower(basename($this->ssg->config['templateSync']['repo_url'],'.git'));
        $this->sourceDir         = $this->ssg->config['permDir'].'/'.$repoBaseDir;

        $repoTemplateDir = $this->ssg->config['templateSync']['repo_template_dir'];
        $repoTemplateDir = preg_replace('(^[\.\/]|[\.\/]$)','',$repoTemplateDir);
        $this->sourceTemplateDir = $this->sourceDir.'/'.$repoTemplateDir;

        $repoAssetBaseDir = $this->ssg->config['templateSync']['repo_asset_base'];
        $repoAssetBaseDir = preg_replace('(^[\.\/]|[\.\/]$)','',$repoAssetBaseDir);
        $this->sourceAssetDir    = $this->sourceDir.'/'.$repoAssetBaseDir;

        $repoStaticBaseDir = $this->ssg->config['templateSync']['repo_static_base'];
        $repoStaticBaseDir = preg_replace('(^[\.\/]|[\.\/]$)','',$repoStaticBaseDir);
        $this->sourceStaticDir   = $this->sourceDir.'/'.$repoStaticBaseDir;

        // $this->destDir           = $this->ssg->config['permDir'];
        // $this->destTemplateDir   = $this->destDir.'/templates/twig/'.$repoTemplateDir;
        // $this->destAssetDir      = $this->destDir.'/templates/assets';
        // $this->destStaticDir     = $this->destDir.'/templates/staticroot';

        $this->freshTemplates     = false;
        $this->updateTemplates    = false;
    }

    public function sync()
    {
        $this->log("Templates: preparing directories ... \n");

        $this->prepareDir($this->sourceDir);
        // $this->prepareDir($this->sourceTemplateDir);
        // $this->prepareDir($this->sourceAssetDir);
        // $this->prepareDir($this->sourceStaticDir);

        // $this->prepareDir($this->destDir);
        // $this->prepareDir($this->destTemplateDir);
        // $this->prepareDir($this->destAssetDir);
        // $this->prepareDir($this->destStaticDir);

        // $this->log("done\n");

        /// if we already have compiled templates
        /// and cached assets+docroot, the we are done
        // if ( $this->verifySource() && $this->verifyDestination() && !$this->freshTemplates )
        // {
        //     /// if we have not been told to refresh anything
        //     /// we are ready to go
        //     $this->log("Templates: using existing templates\n");
        //     $this->mergeSourceIntoDestination();
        //     return true;
        // }

        if ( !$this->sourceRepoExists() || $this->freshTemplates )
        {
            $this->cleanRepo();
            $this->cloneRepo();
            $this->checkoutBranch();
        } else {
            $this->log("Templates: using existing repo ... \n");
        }
        if ( $this->updateTemplates )
        {
            $this->checkoutBranch();
            $this->pullSourceRepo();
        }

        /// even if source is bad, we might have a local copy  of templates to use
        if ( !$this->verifySource() )
        {
            return false;
        }
        return true;

        /// should template object operate straight outa source
        /// or be merged into a diff location before compilation
        /// theoretically, a version of the templates from git
        /// could be checked into the ssg repo in case there was
        /// no git access
        // $this->mergeSourceIntoDestination();
        // return $this->verifyDestination();
    }

    public function cleanRepo()
    {
        $this->log("Templates: cleanup repo ... \n");
        return $this->rmDir($this->sourceDir);
    }

    public function cloneRepo()
    {
        $this->log("Templates: clone repo ... \n");
        /// grab data from source repo
        $git_repo = 'https://'.urlencode($this->ssg->config['templateSync']['repo_user'])
                .':'.urlencode($this->ssg->config['templateSync']['repo_pass'])
                .'@'.$this->ssg->config['templateSync']['repo_url'];

        $clone_cmd = "git clone -c http.sslVerify=false '{$git_repo}' {$this->sourceDir}";
        // $this->log($clone_cmd."\n",false);
        $rslt = `{$clone_cmd} 2>&1`;
        // $this->log($rslt."\n");

        if ( strpos($rslt, 'Authentication failed') !== false ) {
            $this->log("Error - Could not pull from source-repository due to authentication-error.\n");
            return false;
        }

        if ( strpos($rslt, 'not found') !== false ) {
            $this->log("Error - Could not find source-repository\n");
            return false;
        }

        if ( strpos($rslt, 'fatal:') !== false ) {
            $this->log("Error - $rslt\n");
            return false;
        }

        $this->chownDir($this->sourceDir);
        /// $currUser = get_current_user();
        // $chown_cmd = "chown -R {$currUser}:{$currUser} {$this->sourceDir}";
        // // $this->log($chown_cmd."\n",false);
        // $rslt = `{$chown_cmd} 2>&1`;

        return true;
    }

    public function checkoutBranch()
    {
        $this->log("Templates: switch source repo branch ... \n");
        $branch_cmd = "cd {$this->sourceDir}"
                     ." && git checkout {$this->ssg->config['templateSync']['repo_branch']}";
        // $this->log($branch_cmd."\n");
        $rslt = `{$branch_cmd} 2>&1`;
        if ( strpos($rslt, 'error') === 0 ) {
            $this->log("Error - Could not switch to branch \"{$this->ssg->config['templateSync']['repo_branch']}\" in source-repo.\n");
            return false;
        }
    }

    public function pullSourceRepo()
    {
        $this->log("Templates: refreshing current templates ... \n");

        $this->chownDir($this->sourceDir);

        $update_cmd = "cd {$this->sourceDir}"
                     ." && git checkout {$this->ssg->config['templateSync']['repo_branch']}" // 2>&1 >/dev/null
                     ." && git fetch"
                     ." && git pull";
        // $this->log($update_cmd."\n");
        $rslt = `{$update_cmd} 2>&1`; // >/dev/null
        if ( strpos($rslt, 'error') === 0 ) {
            $this->log("Error - Could not pull \"{$this->ssg->config['templateSync']['repo_branch']}\" from source-repo.\n");
            return false;
        }

        return true;
    }
/*
    public function mergeSourceIntoDestination()
    {
        $this->prepareDir($this->sourceTemplateDir);
        $this->copyDir($this->sourceTemplateDir,$this->destTemplateDir);
        $this->copyDir($this->sourceTemplateDir,$this->destTemplateDir);
    }
    public function __mergeSourceIntoDestination()
    {
        if ( is_dir($this->sourceTemplateDir) )
        {
            $mkdir_cmd = "mkdir -p {$this->destTemplateDir}";
            $rslt = `{$mkdir_cmd} 2>&1`;
            // $this->prepareDir($this->destTemplateDir);
            if ( !is_readable($this->sourceTemplateDir) )
            {
                $chmod_cmd = "chmod -R 744 {$this->sourceTemplateDir}";
                $rslt = `{$chmod_cmd} 2>&1`;
                //$this->ssg->chmod_recurse($this->destTemplateDir,0744);
            }
            if ( !is_writable($this->destTemplateDir) )
            {
                $chmod_cmd = "chmod -R 744 {$this->destTemplateDir}";
                $rslt = `{$chmod_cmd} 2>&1`;
                //$this->ssg->chmod_recurse($this->destTemplateDir,0744);
            }
            $cp_cmd = "cp -Rf {$this->sourceTemplateDir}/* {$this->destTemplateDir}/";
            $rslt = `{$cp_cmd} 2>&1`;
            // $this->ssg->copy_recurse( $this->sourceTemplateDir, $this->destTemplateDir );
        }
        if ( is_dir($this->sourceStaticDir) )
        {
            $mkdir_cmd = "mkdir -p {$this->destStaticDir}";
            $rslt = `{$mkdir_cmd} 2>&1`;
            // $this->prepareDir($this->destStaticDir);
            if ( !is_readable($this->sourceStaticDir) )
            {
                $chmod_cmd = "chmod -R 744 {$this->sourceStaticDir}";
                $rslt = `{$chmod_cmd} 2>&1`;
                //$this->ssg->chmod_recurse($this->sourceStaticDir,0744);
            }
            if ( !is_writable($this->destStaticDir) )
            {
                $chmod_cmd = "chmod -R 744 {$this->destStaticDir}";
                $rslt = `{$chmod_cmd} 2>&1`;
                // $this->ssg->chmod_recurse($this->destStaticDir,0744);
            }
            $cp_cmd = "cp -Rf {$this->sourceStaticDir}/* {$this->destStaticDir}/";
            $rslt = `{$cp_cmd} 2>&1`;
            // $this->ssg->copy_recurse( $this->sourceStaticDir,   $this->destStaticDir   );
        }

        /// Asset Dirs
        $asset_dirs = [ 'js', 'css', 'fonts', 'images' ];
        foreach ( $asset_dirs as $dir )
        {
            $sourceAssetDir = "{$this->sourceAssetDir}/{$dir}";
            $destAssetDir   = "{$this->destAssetDir}/{$dir}";

            // $this->prepareDir($sourceAssetDir);
            // if ( !is_readable($sourceAssetDir) )
            // {
            if ( !is_dir($this->sourceAssetDir) || !is_readable($sourceAssetDir) )
            {
                $this->log("Template Merge: error, source not readable: $sourceAssetDir\n");
                continue;
            }
            // $this->log("Template Merge: $sourceAssetDir >> $destAssetDir\n");

            $mkdir_cmd = "mkdir -p {$destAssetDir}";
            $rslt = `{$mkdir_cmd} 2>&1`;
            $this->prepareDir($destAssetDir);
            if ( !is_writable($destAssetDir) )
            {
                $chmod_cmd = "chmod -R 744 {$destAssetDir}";
                $rslt = `{$chmod_cmd} 2>&1`;
                // $this->ssg->chmod_recurse($destAssetDir,0744);
            }
            if ( !is_readable($sourceAssetDir) )
            {
                $chmod_cmd = "chmod -R 744 {$sourceAssetDir}";
                $rslt = `{$chmod_cmd} 2>&1`;
                //$this->ssg->chmod_recurse($sourceAssetDir,0744);
            }
            $cp_cmd = "cp -Rf {$sourceAssetDir}/* {$destAssetDir}/";
            $rslt = `{$cp_cmd} 2>&1`;
            // $this->ssg->copy_recurse($sourceAssetDir,$destAssetDir);
        }
    }
*/
    public function sourceRepoExists()
    {
        if ( !is_dir($this->sourceDir) ) {
            // $this->log("Template Sync: can't find source repo dir: {$this->sourceDir}\n");
            return false;
        }
        if ( !is_dir($this->sourceDir.'/.git') ) {
            // $this->log("Template Sync: source repo dir is not a git repo: {$this->sourceDir}/.git\n");
            return false;
        }
        return true;
    }

    public function verifySource()
    {
        if ( !is_dir($this->sourceAssetDir) ) {
            $this->log("Templates: can't find template asset dir: {$this->sourceAssetDir}\n");
            return false;
        }

        // if ( !is_dir($this->sourceStaticDir) ) {
        //     $this->log("Template Sync: can't find template static dir: {$this->sourceStaticDir}\n");
        //     return false;
        // }

        foreach ( $this->ssg->pageTypes as $type )
        {
            $template_file = "{$this->sourceTemplateDir}/{$type}.twig";
            if ( !file_exists($template_file) )
            {
                $this->log("Template: verify local: can't find template for $type: $template_file");
                return false;
            }
        }
        return true;
    }
/*
    public function verifyDestination()
    {
        if ( !is_dir($this->destAssetDir) ) {
            $this->log("Templates: can't find template asset dir: {$this->destAssetDir}");
            return false;
        }

        if ( !is_dir($this->destStaticDir) ) {
            $this->log("Templates: can't find template static dir: {$this->destStaticDir}");
        }

        // $this->log("Templates: Verifying ".count($this->ssg->pageTypes)." Templates\n");
        foreach ( $this->ssg->pageTypes as $type )
        {
            $template_file = "{$this->destTemplateDir}/{$type}.twig";
            if ( !file_exists($template_file) )
            {
                $this->log("Templates: verify local: can't find template for $type: $template_file");
                return false;
            }
        }
        $this->log("Templates: all templates verified\n");
        return true;
    }
*/
}
