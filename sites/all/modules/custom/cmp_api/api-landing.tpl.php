<body data-gr-c-s-loaded="true">
<div class="swagger-section">
<div id="header">
    <div class="swagger-ui-wrap">
    </div>
</div>
<div id="message-bar" class="swagger-ui-wrap message-success"></div>
<div id="swagger-ui-container" class="swagger-ui-wrap"><div class="info" id="api_info">

    <div class="info_title">USAGov Platform API Interactive Documentation</div>
    <div class="info_description">This is documentation for the <a href="https://www.usa.gov/explore">USAGov</a> Platform API. In addition to this interactive documentation, we also have information on how to use the API available on <a href="https://github.com/usagov/USAGov-Platform-API-Documentation/wiki">GitHub</a>.</div>
</div>
<div class="container" id="resources_container">
<ul id="resources">
<li id="resource_directory_records" class="resource">
<div class="heading">
    <h2>
        <a href="#!/directory_records" class="toggleEndpointList" data-id="directory_records">directory_records</a>  : Directory Records
    </h2>
    <ul class="options">
        <li>
            <a href="#!/directory_records" id="endpointListTogger_directory_records" class="toggleEndpointList" data-id="directory_records">Show/Hide</a>
        </li>
        <li>
            <a href="#" class="collapseResource" data-id="directory_records">
                List Operations
            </a>
        </li>
        <li>
            <a href="#" class="expandResource" data-id="directory_records">
                Expand Operations
            </a>
        </li>
        <li>
            <a href="<?php print $_SERVER['REQUEST_URI'].'/directory_records.json'; ?>">Raw</a>
        </li>
    </ul>
</div>
<ul class="endpoints" id="directory_records_endpoint_list" style="display:none">
<li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="directory_records_Api_V1_DirectoryRecords_index">
            <div class="heading">
                <h3>
                  <span class="http_method">
                  <a href="#!/directory_records/Api_V1_DirectoryRecords_index" class="toggleOperation">get</a>
                  </span>
                  <span class="path">
                  <a href="#!/directory_records/Api_V1_DirectoryRecords_index" class="toggleOperation">usaapi/api/v1/usagov/directory_records.json</a>
                  </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/directory_records/Api_V1_DirectoryRecords_index" class="toggleOperation">Fetches all directory records in the system</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="directory_records_Api_V1_DirectoryRecords_index_content" style="display:none">
                <form accept-charset="UTF-8" class="sandbox">
                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Parameters</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th style="width: 100px; max-width: 100px">Parameter</th>
                            <th style="width: 310px; max-width: 310px">Value</th>
                            <th style="width: 200px; max-width: 200px">Description</th>
                            <th style="width: 100px; max-width: 100px">Parameter Type</th>
                            <th style="width: 220px; max-width: 230px">Data Type</th>
                        </tr>
                        </thead>
                        <tbody class="operation-params">

                        <tr><td class="code">query</td>
                            <td>
                                <input class="parameter" minlength="0" id="query_dir1" name="query" placeholder="" type="text" value="">
                            </td>
                            <td>Search content based on a string parameter</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">string</span>
                            </td>
                        </tr><tr><td class="code">date_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="date_filter_dir1" name="date_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports all content updated since a date, or between two dates seperated by a comma</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">date_filter</span>
                            </td>
                        </tr><tr><td class="code">terms_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="terms_filter_dir1" name="terms_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports filtering for value of fields using key:value pairs seperated by '::', where values can be commas seperated</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">term_filter</span>
                            </td>
                        </tr><tr><td class="code">result_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="result_filter_dir1" name="result_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Filter result fields to provided list, defaults to returning all fields</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">result_filter</span>
                            </td>
                        </tr><tr><td class="code">page_size</td>
                            <td>
                                <input class="parameter" minlength="0" id="page_size_dir1" name="page_size" placeholder="" type="text" value="">
                            </td>
                            <td>Number of results per page</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr><tr><td class="code">page</td>
                            <td>
                                <input class="parameter" minlength="0" id="page_dir1" name="page" placeholder="" type="text" value="">
                            </td>
                            <td>Page number</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr></tbody>
                    </table>
                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Response Messages</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th>HTTP Status Code</th>
                            <th>Reason</th>
                            <th>Response Model</th>
                        </tr>
                        </thead>
                        <tbody class="operation-status">

                        <tr><td width="15%" class="code">200</td>
                            <td>Success</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                            <td>Not Found</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                            <td>The request you made is not acceptable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                            <td>Requested Range Not Satisfiable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                    </table>


                    <div class="sandbox_header dir1_submit">
                        <input class="submit" name="commit" id="dir1_submit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response dir1_submit" style="display:none">
                    <h4>Request URL</h4>
                    <div class="block request_url"></div>
                    <h4>Response Body</h4>
                    <div class="block response_body"></div>
                    <h4>Response Code</h4>
                    <div class="block response_code"></div>
                    <h4>Response Headers</h4>
                    <div class="block response_headers"></div>
                </div>
            </div>
        </li>
    </ul>
</li>
<li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="directory_records_Api_V1_DirectoryRecords_show">
            <div class="heading">
                <h3>
          <span class="http_method">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_show" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_show" class="toggleOperation">usaapi/api/v1/usagov/directory_records/{id}.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/directory_records/Api_V1_DirectoryRecords_show" class="toggleOperation">Fetches a specific directory record from the system</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="directory_records_Api_V1_DirectoryRecords_show_content" style="display:none">
                <form accept-charset="UTF-8" class="sandbox">
                    <div style="margin:0;padding:0;display:inline"></div>

                    <h4>Parameters</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th style="width: 100px; max-width: 100px">Parameter</th>
                            <th style="width: 310px; max-width: 310px">Value</th>
                            <th style="width: 200px; max-width: 200px">Description</th>
                            <th style="width: 100px; max-width: 100px">Parameter Type</th>
                            <th style="width: 220px; max-width: 230px">Data Type</th>
                        </tr>
                        </thead>
                        <tbody class="operation-params">

                        <tr><td class="code required">id</td>
                            <td>
                                <input class="parameter required" minlength="1" id="directory_record_id" name="id" placeholder="(required)" type="text" value="">

                            </td>
                            <td>
                                <strong>Return directory record based on ID</strong>
                            </td>
                            <td>path</td>
                            <td><span class="model-signature">integer</span></td>
                        </tr></tbody>
                    </table>


                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Response Messages</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th>HTTP Status Code</th>
                            <th>Reason</th>
                            <th>Response Model</th>
                        </tr>
                        </thead>
                        <tbody class="operation-status">

                        <tr><td width="15%" class="code">200</td>
                            <td>Success</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                            <td>Not Found</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                            <td>The request you made is not acceptable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                            <td>Requested Range Not Satisfiable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                    </table>


                    <div class="sandbox_header directory_record_submit">
                        <input class="submit" name="commit" id="directory_record_submit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response directory_record_submit" style="display:none">
                    <h4>Request URL</h4>
                    <div class="block request_url"></div>
                    <h4>Response Body</h4>
                    <div class="block response_body"></div>
                    <h4>Response Code</h4>
                    <div class="block response_code"></div>
                    <h4>Response Headers</h4>
                    <div class="block response_headers"></div>
                </div>
            </div>
        </li>
    </ul>
</li><li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="directory_records_Api_V1_DirectoryRecords_autocomplete">
            <div class="heading">
                <h3>
          <span class="http_method">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_autocomplete" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_autocomplete" class="toggleOperation">usaapi/api/v1/usagov/directory_records/autocomplete.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/directory_records/Api_V1_DirectoryRecords_autocomplete" class="toggleOperation">Powers autocomplete style lookup of names and locations of directory records</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="directory_records_Api_V1_DirectoryRecords_autocomplete_content" style="display:none">
                <form accept-charset="UTF-8" class="sandbox">
                    <div style="margin:0;padding:0;display:inline"></div>

                    <h4>Parameters</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th style="width: 100px; max-width: 100px">Parameter</th>
                            <th style="width: 310px; max-width: 310px">Value</th>
                            <th style="width: 200px; max-width: 200px">Description</th>
                            <th style="width: 100px; max-width: 100px">Parameter Type</th>
                            <th style="width: 220px; max-width: 230px">Data Type</th>
                        </tr>
                        </thead>
                        <tbody class="operation-params">

                        <tr><td class="code">name</td>
                            <td>
                                <input class="parameter" minlength="0" id="name_auto" name="name" placeholder="" type="text" value="">
                            </td>
                            <td>Search titles based on matching this string</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">string</span>
                            </td>
                        </tr><tr><td class="code required">directory_type</td>
                            <td>
                                <input class="parameter required" minlength="1" id="directory_type_auto" name="directory_type" placeholder="(required)" type="text" value="">
                            </td>
                            <td>
                                <strong>Matches a type in the directory record</strong>
                            </td>
                            <td>query</td>
                            <td><span class="model-signature">string</span></td>
                        </tr><tr><td class="code">language</td>
                            <td>
                                <input class="parameter" minlength="0" id="language_auto" name="language" placeholder="" type="text" value="">

                            </td>
                            <td>Match a English or Spanish directory record, defaults to English</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">string</span>
                            </td>
                        </tr></tbody>
                    </table>
                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Response Messages</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th>HTTP Status Code</th>
                            <th>Reason</th>
                            <th>Response Model</th>
                        </tr>
                        </thead>
                        <tbody class="operation-status">

                        <tr><td width="15%" class="code">200</td>
                            <td>Success</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                            <td>Not Found</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                            <td>The request you made is not acceptable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                            <td>Requested Range Not Satisfiable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                    </table>
                    <div class="sandbox_header dir_type_auto">
                        <input class="submit" name="commit" id="dir_type_auto" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response dir_type_auto" style="display:none">
                    <h4>Request URL</h4>
                    <div class="block request_url"></div>
                    <h4>Response Body</h4>
                    <div class="block response_body"></div>
                    <h4>Response Code</h4>
                    <div class="block response_code"></div>
                    <h4>Response Headers</h4>
                    <div class="block response_headers"></div>
                </div>
            </div>
        </li>
    </ul>
</li><li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="directory_records_Api_V1_DirectoryRecords_bbb">
            <div class="heading">
                <h3>
          <span class="http_method">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_bbb" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_bbb" class="toggleOperation">usaapi/api/v1/usagov/directory_records/bbb.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/directory_records/Api_V1_DirectoryRecords_bbb" class="toggleOperation">Fetches all better business bureau records in the system</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="directory_records_Api_V1_DirectoryRecords_bbb_content" style="display:none">

                <form accept-charset="UTF-8" class="sandbox">
                    <div style="margin:0;padding:0;display:inline"></div>

                    <h4>Parameters</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th style="width: 100px; max-width: 100px">Parameter</th>
                            <th style="width: 310px; max-width: 310px">Value</th>
                            <th style="width: 200px; max-width: 200px">Description</th>
                            <th style="width: 100px; max-width: 100px">Parameter Type</th>
                            <th style="width: 220px; max-width: 230px">Data Type</th>
                        </tr>
                        </thead>
                        <tbody class="operation-params">

                        <tr><td class="code">query</td>
                            <td>
                                <input class="parameter" minlength="0" id="bbb_query" name="query" placeholder="" type="text" value="">
                            </td>
                            <td>Search content based on a string parameter</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">string</span>
                            </td>
                        </tr><tr><td class="code">date_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="bbb_date_filter" name="date_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports all content updated since a date, or between two dates seperated by a comma</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">date_filter</span>
                            </td>
                        </tr><tr><td class="code">terms_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="bbb_terms_filter" name="terms_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports filtering for value of fields using key:value pairs seperated by '::', where values can be commas seperated</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">term_filter</span>
                            </td>
                        </tr><tr><td class="code">result_filter</td>
                            <td>
                              <input class="parameter" minlength="0" id="bbb_result_filter" name="result_filter" placeholder="" type="text" value="">
                           </td>
                            <td>Filter result fields to provided list, defaults to returning all fields</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">result_filter</span>
                            </td>
                        </tr><tr><td class="code">page_size</td>
                            <td>
                               <input class="parameter" minlength="0" id="bbb_page_size" name="page_size" placeholder="" type="text" value="">
                            </td>
                            <td>Number of results per page</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr><tr><td class="code">page</td>
                            <td>
                                <input class="parameter" minlength="0" id="bbb_page" name="page" placeholder="" type="text" value="">
                            </td>
                            <td>Page number</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr></tbody>
                    </table>
                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Response Messages</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th>HTTP Status Code</th>
                            <th>Reason</th>
                            <th>Response Model</th>
                        </tr>
                        </thead>
                        <tbody class="operation-status">

                        <tr><td width="15%" class="code">200</td>
                            <td>Success</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                            <td>Not Found</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                            <td>The request you made is not acceptable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                            <td>Requested Range Not Satisfiable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                    </table>


                    <div class="sandbox_header bbb_submit">
                        <input class="submit" id="bbb_submit" name="commit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response bbb_submit" style="display:none">
                    <h4>Request URL</h4>
                    <div class="block request_url"></div>
                    <h4>Response Body</h4>
                    <div class="block response_body"></div>
                    <h4>Response Code</h4>
                    <div class="block response_code"></div>
                    <h4>Response Headers</h4>
                    <div class="block response_headers"></div>
                </div>
            </div>
        </li>
    </ul>
</li><li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="directory_records_Api_V1_DirectoryRecords_consumer_agencies">
            <div class="heading">
                <h3>
          <span class="http_method">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_consumer_agencies" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_consumer_agencies" class="toggleOperation">usaapi/api/v1/usagov/directory_records/consumer_agencies.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/directory_records/Api_V1_DirectoryRecords_consumer_agencies" class="toggleOperation">Fetches all records representing consumer agencies in the system</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="directory_records_Api_V1_DirectoryRecords_consumer_agencies_content" style="display:none">
                <form accept-charset="UTF-8" class="sandbox">
                    <div style="margin:0;padding:0;display:inline"></div>

                    <h4>Parameters</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th style="width: 100px; max-width: 100px">Parameter</th>
                            <th style="width: 310px; max-width: 310px">Value</th>
                            <th style="width: 200px; max-width: 200px">Description</th>
                            <th style="width: 100px; max-width: 100px">Parameter Type</th>
                            <th style="width: 220px; max-width: 230px">Data Type</th>
                        </tr>
                        </thead>
                        <tbody class="operation-params">

                        <tr><td class="code">query</td>
                            <td>
                                <input class="parameter" minlength="0" id="ca_query" name="query" placeholder="" type="text" value="">
                            </td>
                            <td>Search content based on a string parameter</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">string</span>
                            </td>
                        </tr><tr><td class="code">date_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="ca_date_filter" name="date_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports all content updated since a date, or between two dates seperated by a comma</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">date_filter</span>
                            </td>
                        </tr><tr><td class="code">terms_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="ca_terms_filter" name="terms_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports filtering for value of fields using key:value pairs seperated by '::', where values can be commas seperated</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">term_filter</span>
                            </td>
                        </tr><tr><td class="code">result_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="ca_result_filter" name="result_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Filter result fields to provided list, defaults to returning all fields</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">result_filter</span>
                            </td>
                        </tr><tr><td class="code">page_size</td>
                            <td>
                                <input class="parameter" minlength="0" id="ca_page_size" name="page_size" placeholder="" type="text" value="">
                            </td>
                            <td>Number of results per page</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr><tr><td class="code">page</td>
                            <td>
                                <input class="parameter" minlength="0" id="ca_page" name="page" placeholder="" type="text" value="">
                            </td>
                            <td>Page number</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr></tbody>
                    </table>


                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Response Messages</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th>HTTP Status Code</th>
                            <th>Reason</th>
                            <th>Response Model</th>
                        </tr>
                        </thead>
                        <tbody class="operation-status">

                        <tr><td width="15%" class="code">200</td>
                            <td>Success</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                            <td>Not Found</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                            <td>The request you made is not acceptable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                            <td>Requested Range Not Satisfiable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                    </table>

                    <div class="sandbox_header ca_submit">
                        <input class="submit" id="ca_submit" name="commit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response ca_submit" style="display:none">
                    <h4>Request URL</h4>
                    <div class="block request_url"></div>
                    <h4>Response Body</h4>
                    <div class="block response_body"></div>
                    <h4>Response Code</h4>
                    <div class="block response_code"></div>
                    <h4>Response Headers</h4>
                    <div class="block response_headers"></div>
                </div>
            </div>
        </li>
    </ul>
</li><li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="directory_records_Api_V1_DirectoryRecords_federal">
            <div class="heading">
                <h3>
          <span class="http_method">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_federal" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_federal" class="toggleOperation">usaapi/api/v1/usagov/directory_records/federal.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/directory_records/Api_V1_DirectoryRecords_federal" class="toggleOperation">Fetches all federal records in the system</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="directory_records_Api_V1_DirectoryRecords_federal_content" style="display:none">
                <form accept-charset="UTF-8" class="sandbox">
                    <div style="margin:0;padding:0;display:inline"></div>

                    <h4>Parameters</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th style="width: 100px; max-width: 100px">Parameter</th>
                            <th style="width: 310px; max-width: 310px">Value</th>
                            <th style="width: 200px; max-width: 200px">Description</th>
                            <th style="width: 100px; max-width: 100px">Parameter Type</th>
                            <th style="width: 220px; max-width: 230px">Data Type</th>
                        </tr>
                        </thead>
                        <tbody class="operation-params">

                        <tr><td class="code">query</td>
                            <td>
                                <input class="parameter" minlength="0" id="fed_query" name="query" placeholder="" type="text" value="">
                            </td>
                            <td>Search content based on a string parameter</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">string</span>
                            </td>
                        </tr><tr><td class="code">date_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="fed_date_filter" name="date_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports all content updated since a date, or between two dates seperated by a comma</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">date_filter</span>
                            </td>
                        </tr><tr><td class="code">terms_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="fed_terms_filter" name="terms_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports filtering for value of fields using key:value pairs seperated by '::', where values can be commas seperated</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">term_filter</span>
                            </td>
                        </tr><tr><td class="code">result_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="fed_result_filter" name="result_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Filter result fields to provided list, defaults to returning all fields</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">result_filter</span>
                            </td>
                        </tr><tr><td class="code">page_size</td>
                            <td>
                                <input class="parameter" minlength="0" id="fed_page_size" name="page_size" placeholder="" type="text" value="">
                            </td>
                            <td>Number of results per page</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr><tr><td class="code">page</td>
                            <td>
                                <input class="parameter" minlength="0" id="fed_page" name="page" placeholder="" type="text" value="">
                            </td>
                            <td>Page number</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr></tbody>
                    </table>
                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Response Messages</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th>HTTP Status Code</th>
                            <th>Reason</th>
                            <th>Response Model</th>
                        </tr>
                        </thead>
                        <tbody class="operation-status">

                        <tr><td width="15%" class="code">200</td>
                            <td>Success</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                            <td>Not Found</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                            <td>The request you made is not acceptable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                            <td>Requested Range Not Satisfiable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                    </table>


                    <div class="sandbox_header fed_submit">
                        <input class="submit" id="fed_submit" name="commit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response fed_submit" style="display:none">
                    <h4>Request URL</h4>
                    <div class="block request_url"></div>
                    <h4>Response Body</h4>
                    <div class="block response_body"></div>
                    <h4>Response Code</h4>
                    <div class="block response_code"></div>
                    <h4>Response Headers</h4>
                    <div class="block response_headers"></div>
                </div>
            </div>
        </li>
    </ul>
</li><li class="endpoint">
<ul class="operations">
<li class="get operation" id="directory_records_Api_V1_DirectoryRecords_state">
<div class="heading">
    <h3>
          <span class="http_method">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_state" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/directory_records/Api_V1_DirectoryRecords_state" class="toggleOperation">usaapi/api/v1/usagov/directory_records/state/{state}.json</a>
          </span>
    </h3>
    <ul class="options">
        <li>
            <a href="#!/directory_records/Api_V1_DirectoryRecords_state" class="toggleOperation">Fetches all records tied to a state in the system, also achievable using a terms_filter=state:state_acronym</a>
        </li>
    </ul>
</div>
<div class="content" id="directory_records_Api_V1_DirectoryRecords_state_content" style="display:none">
    <form accept-charset="UTF-8" class="sandbox">
        <div style="margin:0;padding:0;display:inline"></div>

        <h4>Parameters</h4>
        <table class="fullwidth">
            <thead>
            <tr>
                <th style="width: 100px; max-width: 100px">Parameter</th>
                <th style="width: 310px; max-width: 310px">Value</th>
                <th style="width: 200px; max-width: 200px">Description</th>
                <th style="width: 100px; max-width: 100px">Parameter Type</th>
                <th style="width: 220px; max-width: 230px">Data Type</th>
            </tr>
            </thead>
            <tbody class="operation-params">

            <tr><td class="code required">state</td>
                <td>
                    <input class="parameter required" minlength="1" id="state_state" name="state" placeholder="(required)" type="text" value="">
                </td>
                <td>
                    <strong>Return directory records based on state</strong>
                </td>
                <td>path</td>
                <td><span class="model-signature">string</span></td>
            </tr><tr><td class="code">query</td>
                <td>
                    <input class="parameter" minlength="0" id="state_query" name="query" placeholder="" type="text" value="">
                </td>
                <td>Search content based on a string parameter</td>
                <td>query</td>
                <td>
                    <span class="model-signature">string</span>
                </td>
            </tr><tr><td class="code">date_filter</td>
                <td>
                    <input class="parameter" minlength="0" id="state_date_filter" name="date_filter" placeholder="" type="text" value="">
                </td>
                <td>Supports all content updated since a date, or between two dates seperated by a comma</td>
                <td>query</td>
                <td>
                    <span class="model-signature">date_filter</span>
                </td>
            </tr><tr><td class="code">terms_filter</td>
                <td>
                    <input class="parameter" minlength="0" id="state_terms_filter" name="terms_filter" placeholder="" type="text" value="">
                </td>
                <td>Supports filtering for value of fields using key:value pairs seperated by '::', where values can be commas seperated</td>
                <td>query</td>
                <td>
                    <span class="model-signature">term_filter</span>
                </td>
            </tr><tr><td class="code">result_filter</td>
                <td>
                    <input class="parameter" minlength="0" id="state_result_filter" name="result_filter" placeholder="" type="text" value="">
                </td>
                <td>Filter result fields to provided list, defaults to returning all fields</td>
                <td>query</td>
                <td>
                    <span class="model-signature">result_filter</span>
                </td>
            </tr><tr><td class="code">page_size</td>
                <td>
                    <input class="parameter" minlength="0" id="state_page_size" name="page_size" placeholder="" type="text" value="">
                </td>
                <td>Number of results per page</td>
                <td>query</td>
                <td>
                    <span class="model-signature">integer</span>
                </td>
            </tr><tr><td class="code">page</td>
                <td>
                    <input class="parameter" minlength="0" id="state_page" name="page" placeholder="" type="text" value="">
                </td>
                <td>Page number</td>
                <td>query</td>
                <td>
                    <span class="model-signature">integer</span>
                </td>
            </tr></tbody>
        </table>

        <div style="margin:0;padding:0;display:inline"></div>
        <h4>Response Messages</h4>
        <table class="fullwidth">
            <thead>
            <tr>
                <th>HTTP Status Code</th>
                <th>Reason</th>
                <th>Response Model</th>
            </tr>
            </thead>
            <tbody class="operation-status">

            <tr><td width="15%" class="code">200</td>
                <td>Success</td>
                <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                <td>Not Found</td>
                <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                <td>The request you made is not acceptable</td>
                <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                <td>Requested Range Not Satisfiable</td>
                <td width="50%"><span class="model-signature"></span></td></tr></tbody>
        </table>


        <div class="sandbox_header state_submit">
            <input class="submit" id="state_submit" name="commit" type="button" value="Try it out!">
            <a href="#" class="response_hider" style="display:none">Hide Response</a>
            <span class="response_throbber" style="display:none"></span>
        </div>

    </form>
    <div class="response state_submit" style="display:none">
        <h4>Request URL</h4>
        <div class="block request_url"></div>
        <h4>Response Body</h4>
        <div class="block response_body"></div>
        <h4>Response Code</h4>
        <div class="block response_code"></div>
        <h4>Response Headers</h4>
        <div class="block response_headers"></div>
    </div>
</div>
</li>
</ul>
</li></ul>
</li>
<li id="resource_text_assets" class="resource">
<div class="heading">
    <h2>
        <a href="#!/text_assets" class="toggleEndpointList" data-id="text_assets">text_assets</a>  : Narrative Content
    </h2>
    <ul class="options">
        <li>
            <a href="#!/text_assets" id="endpointListTogger_text_assets" class="toggleEndpointList" data-id="text_assets">Show/Hide</a>
        </li>
        <li>
            <a href="#" class="collapseResource" data-id="text_assets">
                List Operations
            </a>
        </li>
        <li>
            <a href="#" class="expandResource" data-id="text_assets">
                Expand Operations
            </a>
        </li>
        <li>
            <a href="<?php print $_SERVER['REQUEST_URI'].'/narratives.json'; ?>">Raw</a>
        </li>
    </ul>
</div>
<ul class="endpoints" id="text_assets_endpoint_list" style="display: none">
<li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="text_assets_Api_V1_TextAssets_index">
            <div class="heading">
                <h3>
          <span class="http_method">
          <a href="#!/text_assets/Api_V1_TextAssets_index" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/text_assets/Api_V1_TextAssets_index" class="toggleOperation">usaapi/narratives.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/text_assets/Api_V1_TextAssets_index" class="toggleOperation">Fetches all narrative content from the system, with the ablity to query and narrow down results</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="text_assets_Api_V1_TextAssets_index_content" style="display: none">
                  <form accept-charset="UTF-8" class="sandbox">
                    <div style="margin:0;padding:0;display:inline"></div>

                    <h4>Parameters</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th style="width: 100px; max-width: 100px">Parameter</th>
                            <th style="width: 310px; max-width: 310px">Value</th>
                            <th style="width: 200px; max-width: 200px">Description</th>
                            <th style="width: 100px; max-width: 100px">Parameter Type</th>
                            <th style="width: 220px; max-width: 230px">Data Type</th>
                        </tr>
                        </thead>
                        <tbody class="operation-params">

                        <tr><td class="code">query</td>
                            <td>
                                <input class="parameter" minlength="0" id="query1" placeholder="" type="text" value="">
                            </td>
                            <td>Search content based on a string parameter</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">string</span>
                            </td>
                        </tr><tr><td class="code">date_filter</td>
                            <td>
                               <input class="parameter" minlength="0" id="date_filter1" placeholder="" type="text" value="">
                            </td>
                            <td>Supports all content updated since a date, or between two dates seperated by a comma</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">date_filter</span>
                            </td>
                        </tr><tr><td class="code">terms_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="terms_filter1" placeholder="" type="text" value="">
                            </td>
                            <td>Supports filtering for exact value of fields using key:value pairs seperated by '::', where values can be commas seperated</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">term_filter</span>
                            </td>
                        </tr><tr><td class="code">result_filter</td>
                            <td>
                                <input class="parameter" minlength="0" id="result_filter1" placeholder="" type="text" value="">
                            </td>
                            <td>Filter result fields to provided list, defaults to returning all fields</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">result_filter</span>
                            </td>
                        </tr><tr><td class="code">page_size</td>
                            <td>
                                <input class="parameter" minlength="0" id="page_size1" placeholder="" type="text" value="">
                            </td>
                            <td>Number of results per page</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr><tr><td class="code">page</td>
                            <td>
                                <input class="parameter" minlength="0" id="page1" placeholder="" type="text" value="">
                            </td>
                            <td>Page number</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr></tbody>
                    </table>
                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Response Messages</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th>HTTP Status Code</th>
                            <th>Reason</th>
                            <th>Response Model</th>
                        </tr>
                        </thead>
                        <tbody class="operation-status">

                        <tr><td width="15%" class="code">200</td>
                            <td>Success</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                            <td>Not Found</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                            <td>The request you made is not acceptable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                            <td>Requested Range Not Satisfiable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                    </table>


                    <div class="sandbox_header text_asset_all_submit">
                        <input id="text_asset_all_submit" class="submit" name="commit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response text_asset_all_submit" style="display:none">
                    <h4>Request URL</h4>
                    <div class="block request_url"></div>
                    <h4>Response Body</h4>
                    <div class="block response_body"></div>
                    <h4>Response Code</h4>
                    <div class="block response_code"></div>
                    <h4>Response Headers</h4>
                    <div class="block response_headers"></div>
                </div>
            </div>
        </li>
    </ul>
</li><li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="text_assets_Api_V1_TextAssets_show">
            <div class="heading">
                <h3>
          <span class="http_method">
          <a href="#!/text_assets/Api_V1_TextAssets_show" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/text_assets/Api_V1_TextAssets_show" class="toggleOperation">usaapi/narratives/{id}.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/text_assets/Api_V1_TextAssets_show" class="toggleOperation">Returns a single text asset by id</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="text_assets_Api_V1_TextAssets_show_content" style="display:none">

                <form accept-charset="UTF-8" class="sandbox" >
                    <div style="margin:0;padding:0;display:inline"></div>

                    <h4>Parameters</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th style="width: 100px; max-width: 100px">Parameter</th>
                            <th style="width: 310px; max-width: 310px">Value</th>
                            <th style="width: 200px; max-width: 200px">Description</th>
                            <th style="width: 100px; max-width: 100px">Parameter Type</th>
                            <th style="width: 220px; max-width: 230px">Data Type</th>
                        </tr>
                        </thead>
                        <tbody class="operation-params">

                        <tr><td class="code required">id</td>
                            <td>
                                <input class="parameter required" minlength="1" id="text_asset_id" placeholder="(required)" type="text" value="">
                            </td>
                            <td>
                                <strong>Return specified text asset</strong>
                            </td>
                            <td>path</td>
                            <td><span class="model-signature">integer</span></td>
                        </tr></tbody>
                    </table>
                    <div style="margin:0;padding:0;display:inline"></div>
                    <h4>Response Messages</h4>
                    <table class="fullwidth">
                        <thead>
                        <tr>
                            <th>HTTP Status Code</th>
                            <th>Reason</th>
                            <th>Response Model</th>
                        </tr>
                        </thead>
                        <tbody class="operation-status">

                        <tr><td width="15%" class="code">200</td>
                            <td>Success</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                            <td>Not Found</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                            <td>The request you made is not acceptable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                            <td>Requested Range Not Satisfiable</td>
                            <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                    </table>

                    <div class="sandbox_header text_asset_submit_response">
                        <input id="text_asset_submit" class="submit " name="commit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>
                </form>
                <div class="response text_asset_submit_response" style="display:none">
                    <h4>Request URL</h4>
                    <div class="block request_url"></div>
                    <h4>Response Body</h4>
                    <div class="block response_body"></div>
                    <h4>Response Code</h4>
                    <div class="block response_code"></div>
                    <h4>Response Headers</h4>
                    <div class="block response_headers"></div>
                </div>
            </div>
        </li>
    </ul>
</li></ul>
</li>
<li id="resource_entities" class="resource">
    <div class="heading">
        <h2>
            <a href="#!/entities" class="toggleEndpointList" data-id="entities">entities</a>  : All Contents
        </h2>
        <ul class="options">
            <li>
                <a href="#!/entities" id="endpointListTogger_entities" class="toggleEndpointList" data-id="entities">Show/Hide</a>
            </li>
            <li>
                <a href="#" class="collapseResource" data-id="entities">
                    List Operations
                </a>
            </li>
            <li>
                <a href="#" class="expandResource" data-id="entities">
                    Expand Operations
                </a>
            </li>
            <li>
                <a href="<?php print $_SERVER['REQUEST_URI'].'/entities'; ?>">Raw</a>
            </li>
        </ul>
    </div>
    <ul class="endpoints" id="entities_endpoint_list" style="display: none">
        <li class="endpoint">
            <ul class="operations">
                <li class="get operation" id="entities_index">
                    <div class="heading">
                        <h3>
          <span class="http_method">
          <a href="#!/entities_index" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/entities_index" class="toggleOperation">usaapi/entities</a>
          </span>
                        </h3>
                        <ul class="options">
                            <li>
                                <a href="#!/entities_index" class="toggleOperation">Fetches all contents from the system, with the ability to query and narrow down results</a>
                            </li>
                        </ul>
                    </div>
                    <div class="content" id="entities_index_content" style="display: none">
                        <form accept-charset="UTF-8" class="sandbox">
                            <div style="margin:0;padding:0;display:inline"></div>

                            <h4>Parameters</h4>
                            <table class="fullwidth">
                                <thead>
                                <tr>
                                    <th style="width: 100px; max-width: 100px">Parameter</th>
                                    <th style="width: 310px; max-width: 310px">Value</th>
                                    <th style="width: 200px; max-width: 200px">Description</th>
                                    <th style="width: 100px; max-width: 100px">Parameter Type</th>
                                    <th style="width: 220px; max-width: 230px">Data Type</th>
                                </tr>
                                </thead>
                                <tbody class="operation-params">

                                <tr><td class="code">page_size</td>
                                    <td>
                                        <input class="parameter" minlength="0" id="entities_page_size" placeholder="" type="text" value="">
                                    </td>
                                    <td>Number of results per page</td>
                                    <td>query</td>
                                    <td>
                                        <span class="model-signature">integer</span>
                                    </td>
                                </tr></tbody>
                            </table>
                            <div style="margin:0;padding:0;display:inline"></div>
                            <h4>Response Messages</h4>
                            <table class="fullwidth">
                                <thead>
                                <tr>
                                    <th>HTTP Status Code</th>
                                    <th>Reason</th>
                                    <th>Response Model</th>
                                </tr>
                                </thead>
                                <tbody class="operation-status">

                                <tr><td width="15%" class="code">200</td>
                                    <td>Success</td>
                                    <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">404</td>
                                    <td>Not Found</td>
                                    <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">406</td>
                                    <td>The request you made is not acceptable</td>
                                    <td width="50%"><span class="model-signature"></span></td></tr><tr><td width="15%" class="code">500</td>
                                    <td>Requested Range Not Satisfiable</td>
                                    <td width="50%"><span class="model-signature"></span></td></tr></tbody>
                            </table>


                            <div class="sandbox_header entities_submit">
                                <input id="entities_submit" class="submit" name="commit" type="button" value="Try it out!">
                                <a href="#" class="response_hider" style="display:none">Hide Response</a>
                                <span class="response_throbber" style="display:none"></span>
                            </div>
                        </form>
                        <div class="response entities_submit" style="display:none">
                            <h4>Request URL</h4>
                            <div class="block request_url"></div>
                            <h4>Response Body</h4>
                            <div class="block response_body"></div>
                            <h4>Response Code</h4>
                            <div class="block response_code"></div>
                            <h4>Response Headers</h4>
                            <div class="block response_headers"></div>
                        </div>
                    </div>
                </li>
            </ul>
        </li>
        </ul>
</li>
</ul>

<div class="footer">
    <br>
    <br>
    <h4 style="color: #999">[ <span style="font-variant: small-caps">base url</span>: https://platform-api.usa.gov/

        , <span style="font-variant: small-caps">api version</span>: 1.0
        ]</h4>
</div>
</div>
</div>
</div>
</body>