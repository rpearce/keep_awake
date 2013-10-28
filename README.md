# KeepAwake
Give your app a good wakeup call with KeepAwake. The sleeper must awaken.

## Tools
- [expresjs](http://expressjs.com)
- [node-parse-api](https://github.com/Leveton/node-parse-api)
- [node-cron](https://github.com/ncb000gt/node-cron)
- [request](https://github.com/mikeal/request)

## Set up
Create an app on [Parse](https://parse.com).
Set 2 environment variables from your terminal for PARSE_APP_ID and PARSE_MASTER_KEY.

For example:

		$ export PARSE_APP_ID=aasdfasdjfkasdjflskdflsdkf123
		$ export PARSE_MASTER_KEY=324987asdfakj3984asdlfj2387

Install dependencies:

		$ npm install

Start the server:

		$ node app.js

Navigate to:

		http://localhost:5000


## To-Do
- Add show pages (has all info as well as log info)
- Write tests

# What is this?

**tl;dr => keep your apps from falling asleep with [KeepAwake](https://keep-awake.herokuapp.com)**

## The Problem
If your Heroku app doesn't get traffic which justifies you spending $0.05/hr (~$34/mo) and you run it on 1 dyno, you've probably noticed that it seems to fall asleep. If your app doesn't get traffic within ~10 minutes of its last request and you are running on 1 dyno, Heroku will expires your resource and allocate it elsewhere. The issue with this, especially if you're running anything with Ruby, is that it will take a significant amount of time to re-allocate that resource to your application and spin it back up.

One solution (with Ruby) is to create a rake task which performs an HTTP GET:

```ruby
# Note: example is for HTTPS request
namespace :my_app do
  task :call_page => :environment do
    require 'net/http'
    url = URI.parse(URI.encode("https://www.myapp.com"))
    response = Net::HTTP.start(url.host, use_ssl: true, verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
       http.get url.request_uri
    end
  end
end
```
and then use [Heroku's Scheduler Add-On](https://devcenter.heroku.com/articles/scheduler) to run the task every 10 minutes, preventing your app from falling asleep! Huzzah! EXCEPT...when you perform jobs with Heroku Scheduler, it spins up *another* dyno, thus bringing your total dyno count to 2 (aka $0.05/hr) and leaves you with a small but obnoxious bill at the end of the month.

## The Solution
I created a little nodejs app called [KeepAwake](https://keep-awake.herokuapp.com) which performs an HTTP GET every 5 minutes on all of the domains that are saved to it, thus telling Heroku to keep those apps awake!

Enjoy!