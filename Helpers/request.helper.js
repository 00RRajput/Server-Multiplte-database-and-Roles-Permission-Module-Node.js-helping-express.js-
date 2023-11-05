const https = require('https');
const { Curl } = require('node-libcurl');
const { generateCustomeError } = require('./error.helper');
/**
 * 
 * @param {object} data - data object
 * @param {string} data.host - host url string.
 * @param {string} data.endpoint - request endpoint.
 * @param {string} data.method - GET|POST --default GET.
 * @param {object} data.body - json body.
 * @param {object} data.headers - headers object
 * @param {integer} data.port - port --defaults to 443
 * @returns {promise} promise ( data || error)
 */
const lookup = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data?.host) await generateCustomeError('missing host url !');
            if (data?.method === 'GET' && data?.body) await generateCustomeError('data body not allowed !');
 
            if (data.headers['Content-Type'] === 'application/json') {
                const postData = JSON.stringify(data?.body || {});
                data.headers['Content-Length'] = Buffer.byteLength(postData);
            }
            
    
            const options = {
                hostname: data?.host,
                path: data?.endpoint,
                port: data?.port,
                method: data?.method || "GET",
                headers: data?.headers || { 'Content-Type': 'application/json' }
            }
            
            const request = https.request(options, (response) => {
                let responseData = '';

                response.setEncoding('utf8');
                response.on('data', (dataChunk) => {
                    responseData += dataChunk;
                });
                response.on('end', () => {
                    // Handle the response data
                    try {
                        console.log('responseData',responseData);
                        responseData = JSON.parse(responseData);
                        resolve(responseData);
                    } catch (error) {
                        reject(error);
                    }
                });
            })
            request.on('error', (error) => {
                reject(error);
            });

            if (data.headers['Content-Type'].includes('multipart/form-data'))
                data.body.pipe(request);

            if (data.headers['Content-Type'] === 'application/json') 
                request.write(postData);

            request.end();
        } catch (error) {
            reject(error);
        }
    })
}

const curlFormPost = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const curl = new Curl();

            curl.setOpt('URL', data.url);
            curl.setOpt('HTTPPOST', data.formData);
            curl.setOpt('FOLLOWLOCATION', true);

            curl.on('end', (statusCode, data) => {
                curl.close();
                resolve({ status: statusCode, data  });
            });

            curl.on('error', (error) => {
                curl.close();
                reject(error);
            });

            curl.perform();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { lookup, curlFormPost }