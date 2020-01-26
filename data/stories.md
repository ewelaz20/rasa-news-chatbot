## getNews happy path 1
* getNews
    - get_news
    - form{"name": "get_news"}
    - slot{"requested_slot": "topic_news"}
* form: choose{"topic_news": "sports"}
    - slot{"topic_news": "sports"}
    - form: get_news
    - slot{"topic_news": "sports"}
    - form{"name": null}
    - slot{"requested_slot": null}
    - action_restart

## thankyou (general)    
* thank_you
    - utter_welcome

## chat flow 1 (general)
* bot_general
    - utter_reply_bot_general

## chat flow 2 (identity)
* bot_identity
    - utter_reply_bot_identity

## greet (general)
* greet
    - utter_hello

## getNews happy path 2
* getNews{"topic_news": "astronomy"}
    - slot{"topic_news": "astronomy"}
    - get_news
    - form{"name": "get_news"}
    - slot{"topic_news": "astronomy"}
    - form{"name": null}
    - slot{"requested_slot": null}
    - action_restart

## getNews happy path 3
* getNews{"topic_news": "physics"}
    - slot{"topic_news": "physics"}
    - get_news
    - form{"name": "get_news"}
    - slot{"topic_news": "physics"}
    - form{"name": null}
    - slot{"requested_slot": null}
    - action_restart

## bye (general)
* bye
    - utter_end

## Thank you and bye

* thank_you
    - utter_welcome
* bye
    - utter_end

## greet (ask bot how is he)

* greet
    - utter_hello
* fettle
	- utter_bot_help
* bot_general
    - utter_reply_bot_general

## greet ( with how are you ask)

* greet
    - utter_hello
* fettle
    - utter_bot_help
* getNews
    - get_news
    - form{"name":"get_news"}
    - slot{"requested_slot":"topic_news"}
* getNews
    - get_news
    - slot{"topic_news":"sport"}
    - form{"name":null}
    - slot{"requested_slot":null}
    - action_restart

## Not satisfied, get news
* getNews
    - get_news
    - form{"name": "get_news"}
    - slot{"requested_slot": "topic_news"}
* form: choose{"topic_news": "sports"}
    - slot{"topic_news": "sports"}
    - form: get_news
    - slot{"topic_news": "sports"}
    - form{"name": null}
    - slot{"requested_slot": null}
* deny:
    - utter_service_not_good

## not satisfied - deny
* deny
    - utter_service_not_good
* getNews
    - utter_ask_topic_news

## not satisfied - deny 2
* deny
    - utter_service_not_good
* getNews
    - get_news
    - form{"name": "get_news"}
    - slot{"requested_slot": "topic_news"}
* form: choose{"topic_news": "sports"}
    - slot{"topic_news": "sports"}
    - form: get_news
    - slot{"topic_news": "sports"}
    - form{"name": null}
    - slot{"requested_slot": null}
    - action_restart

* notunderstanding
    - utter_acknowledge_notunderstanding
