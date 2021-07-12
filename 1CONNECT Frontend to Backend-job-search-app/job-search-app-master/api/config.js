module.exports = {
  APP_ID: process.env.APP_ID,
  API_KEY: process.env.API_KEY,
  BASE_URL: 'https://api.adzuna.com/v1/api/jobs',
  BASE_PARAMS: 'search/1?&results_per_page=20&content-type=application/json',
};
// Important! I forgot to mention in the video you'll need to export your APP_ID and API_KEY when you run the Node.js server script.  In your terminal type:
// export APP_ID=:Your App ID:
// export API_KEY=:Your API Key:
// (Obviously putting your own App and API keys in). This will make sure the Node server script will send the correct credentials to Adzuna.
