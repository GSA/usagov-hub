const util = require('util');
const exec = util.promisify(require('child_process').exec);

const generateAnalyticsReporterData = async (event) =>
{
    console.log('GenerateAnalyticsReport triggered');

    /// parameters may be right in env, or may be part of sns message
    var params = event;
    if ( event && 'Records' in event 
         && 0 in event.Records 
         && 'Sns' in event.Records[0] 
         && 'Message' in event.Records[0].Sns 
         && event.Records[0].Sns.Message )
    {
        /// Message from Sns may be a json object
        try {
            console.log('Parameters From SNS:'+event.Records[0].Sns.Message);
            params = JSON.parse( event.Records[0].Sns.Message );
        } catch (err) {
            console.log('SNS Message is not json, ignoring input');
        }
    }

    var env_prefix = null;
    if ( params && 'ENVIRONMENT' in params ) 
    {
        env_prefix = params.ENVIRONMENT;
    } else if ( 'ENVIRONMENT' in process.env ) {
        env_prefix = process.env.ENVIRONMENT;
    } else {
        env_prefix = 'prod';
    }
    await buildEnvFromParamterStore(env_prefix);

    var reports = [
        {"id":"ga:147714046","path":"analytics/raw-data"},
        {"id":"ga:147749852","path":"analytics/raw-data/gobierno"},
        {"id":"ga:147777730","path":"analytics/raw-data/usagov"}
    ];    
    if ( params && 'ANALYTICS_REPORTS' in params ) {
        reports = params.ANALYTICS_REPORTS;
    } else if ( 'ANALYTICS_REPORTS' in process.env ) {
        reports = JSON.parse(process.env.ANALYTICS_REPORTS);    
    }

    process.env.ANALYTICS_REPORTS_PATH = './reports/usagov-analytics.json';

    var frequency = null;
    if ( params && "FREQUENCY" in params )
    {
        frequency = params.FREQUENCY;
    }

    await runReports(reports,frequency);

    // var csv = false;
    // if ( params && "CSV" in params )
    // {
    //     csv = params.CSV;
    // }
    // await runReports(reports,frequency,csv);
}

const runReports = async ( reports, frequency ) =>
{
    var successes = 0;
    for ( var r=0; r<reports.length; r++ )
    {
        console.log('Report '+reports[r].id+' generating');
        await runReport( reports[r], frequency );
    }
    return successes;
}

const runReport = async (report, frequency) => 
{
    var analyticsCommand = './bin/analytics --publish';
    if ( frequency )
    {
        analyticsCommand += ' --frequency '+frequency;
    }
    // if ( csv ) 
    // {
    //     analyticsCommand += ' --csv';
    // }

    process.env.AWS_CACHE_TIME       = 0;  
    process.env.ANALYTICS_REPORT_IDS = report.id;
    process.env.AWS_BUCKET_PATH      = report.path;
    
    var analyticsCommandJSON = analyticsCommand;
    console.log(analyticsCommandJSON);
    await exec(analyticsCommandJSON, { stdio: 'inherit' });
    console.log('JSON Report '+report.id+' generation finished'); 

    analyticsCommandCSV = analyticsCommand + ' --csv';
    console.log(analyticsCommandCSV);
    await exec(analyticsCommandCSV, { stdio: 'inherit' });
    console.log('CSV Report '+report.id+' generation finished'); 

    // const { stdoutJSON, stderrJSON } = await exec(analyticsCommandJSON);
    // if ( stderrJSON )
    // {
    //     console.log('JSON Report '+report.id+' errored: '+stderrJSON);
    // }
    // console.log('JSON Report '+report.id+' generated '+stdoutJSON);

    // analyticsCommandCSV = analyticsCommand + ' --csv';
    // console.log(analyticsCommandCSV);
    // const { stdoutCSV, stderrCSV } = await exec(analyticsCommandCSV);
    // if ( stderrJson ) 
    // {
    //     console.log('CSV Report '+report.id+' errored: '+stderrCSV);
    // }
    // console.log('CSV Report '+report.id+' generated '+stdoutCSV);

    return true;
}


const buildEnvFromParamterStore = async ( env_prefix ) =>
{

    /// set region
    var AWS = require('aws-sdk');
    if ( 'AWS_REGION' in process.env )
    {
        AWS.config.update({region:process.env.AWS_REGION});
    } else if ( 'AWS_DEFAULT_REGION' in process.env ) {
        AWS.config.update({region:process.env.AWS_DEFAULT_REGION});
    } else {
        AWS.config.update({region:'us-east-1'});
    }

    var param_prefix = "/project_app_usa/";

    /// wrap in //
    if ( ! param_prefix.match(/\/$/) )
    {
        param_prefix += '/';
    }
    if ( ! param_prefix.match(/^\//) )
    {
        param_prefix = '/'+param_prefix;
    }

    /// append environment name
    param_prefix += env_prefix;
    if ( ! param_prefix.match(/\/$/) )
    {
        param_prefix += '/';
    }

    param_prefix += 'analytics_reporters/';

    var ssm = new AWS.SSM();
    return ssm.getParametersByPath({
        Path: param_prefix,
        Recursive: true,
        WithDecryption: true,
    }).promise().then( data => {
        for ( var i=0; i<data.Parameters.length; i++ )
        {
            var envVar = data.Parameters[i].Name.replace(param_prefix,"");
            process.env[envVar] = data.Parameters[i].Value;
        }
    }).catch( err => {
        console.error(err, err.stack);
    });
}

exports.generateAnalyticsReporterData = generateAnalyticsReporterData