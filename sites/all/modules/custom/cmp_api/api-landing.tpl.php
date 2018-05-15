<body data-gr-c-s-loaded="true">
<div class="swagger-section">
<div id="header">
    <div class="swagger-ui-wrap">
        <form id="api_selector" class="navbar-form navbar-left" role="search">
            <div class="form-group">
                <div class="input"><input placeholder="http://example.com/api" id="input_baseUrl" name="baseUrl" type="text"></div>
                <div class="input"><input placeholder="api_key" id="input_apiKey" name="apiKey" type="text"></div>
                <div class="input"><a id="explore" href="#">Explore</a></div>
            </div>
        </form>
    </div>
</div>
<div id="message-bar" class="swagger-ui-wrap message-success"></div>
<div id="swagger-ui-container" class="swagger-ui-wrap"><div class="info" id="api_info">

    <div class="info_title">USAGov Platform API Interactive Documentation</div>
    <div class="info_description">This is documentation for the <a href="https://www.usa.gov/explore">USAGov</a> Platform API. In addition to this interactive documentation, we also have information on how to use the API available on <a href="https://github.com/usagov/USAGov-Platform-API-Documentation/wiki">GitHub</a>.</div>
</div>
<div class="container" id="resources_container">
<ul id="resources">
<li id="resource_text_assets" class="resource active"><div class="heading">
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
            <a href="https://platform-api.usa.gov/swagger_docs/api/v1/text_assets.json">Raw</a>
        </li>
    </ul>
</div>
<ul class="endpoints" id="text_assets_endpoint_list" style="display: block;">

<li class="endpoint">
    <ul class="operations">
        <li class="get operation" id="text_assets_Api_V1_TextAssets_index">
            <div class="heading">
                <h3>
          <span class="http_method">
          <a href="#!/text_assets/Api_V1_TextAssets_index" class="toggleOperation">get</a>
          </span>
          <span class="path">
          <a href="#!/text_assets/Api_V1_TextAssets_index" class="toggleOperation">api/v1/usagov/narratives.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/text_assets/Api_V1_TextAssets_index" class="toggleOperation">Fetches all narrative content from the system, with the ablity to query and narrow down results</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="text_assets_Api_V1_TextAssets_index_content" style="">
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
                                <input class="parameter" minlength="0" name="query" placeholder="" type="text" value="">
                            </td>
                            <td>Search content based on a string parameter</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">string</span>
                            </td>
                        </tr><tr><td class="code">date_filter</td>
                            <td>
                               <input class="parameter" minlength="0" name="date_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports all content updated since a date, or between two dates seperated by a comma</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">date_filter</span>
                            </td>
                        </tr><tr><td class="code">terms_filter</td>
                            <td>
                                <input class="parameter" minlength="0" name="terms_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Supports filtering for exact value of fields using key:value pairs seperated by '::', where values can be commas seperated</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">term_filter</span>
                            </td>
                        </tr><tr><td class="code">result_filter</td>
                            <td>
                                <input class="parameter" minlength="0" name="result_filter" placeholder="" type="text" value="">
                            </td>
                            <td>Filter result fields to provided list, defaults to returning all fields</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">result_filter</span>
                            </td>
                        </tr><tr><td class="code">page_size</td>
                            <td>
                                <input class="parameter" minlength="0" name="page_size" placeholder="" type="text" value="">
                            </td>
                            <td>Number of results per page</td>
                            <td>query</td>
                            <td>
                                <span class="model-signature">integer</span>
                            </td>
                        </tr><tr><td class="code">page</td>
                            <td>
                                <input class="parameter" minlength="0" name="page" placeholder="" type="text" value="">
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


                    <div class="sandbox_header">
                        <input class="submit" name="commit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response" style="display:none">
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
          <a href="#!/text_assets/Api_V1_TextAssets_show" class="toggleOperation">api/v1/usagov/narratives/{id}.json</a>
          </span>
                </h3>
                <ul class="options">
                    <li>
                        <a href="#!/text_assets/Api_V1_TextAssets_show" class="toggleOperation">Returns a single text asset by id</a>
                    </li>
                </ul>
            </div>
            <div class="content" id="text_assets_Api_V1_TextAssets_show_content" style="display:none">

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
                                <input class="parameter required" minlength="1" name="id" placeholder="(required)" type="text" value="">
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

                    <div class="sandbox_header">
                        <input class="submit" name="commit" type="button" value="Try it out!">
                        <a href="#" class="response_hider" style="display:none">Hide Response</a>
                        <span class="response_throbber" style="display:none"></span>
                    </div>

                </form>
                <div class="response" style="display:none">
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