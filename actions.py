from rasa_sdk import ActionExecutionRejection
from rasa_sdk import Tracker
from rasa_sdk.events import SlotSet, FollowupAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormAction, REQUESTED_SLOT, Action
from rasa.core.slots import Slot
from typing import Dict, Text, Any, List, Union

import sqlite3
import requests

##
#%%

##############################################################################################################

NEWS_API_KEY = 'a02497b608ff4cbab7fba93ac01e459c'  

##############################################################################################################

#%%

# A form action to fetch news from the internet
class getNews(FormAction):
    def name(self):
        return "get_news"
    
    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:
        """A list of required slots that the form has to fill"""

        return ["topic_news"]

    def slot_mappings(self):
        return {"topic_news": [self.from_text(intent=[None, "getNews", "inform"]), 
                               self.from_entity(entity="topic_news", intent =["getNews"])]}

    def validate(self,
                 dispatcher: CollectingDispatcher,
                 tracker: Tracker,
                 domain: Dict[Text, Any]) -> List[Dict]:

        slot_values = self.extract_other_slots(dispatcher, tracker, domain)
        
        # extract requested slot
        slot_to_fill = tracker.get_slot(REQUESTED_SLOT)
        if slot_to_fill:
            slot_values.update(self.extract_requested_slot(dispatcher, tracker, domain))
            if not slot_values:
                # reject form action execution
                # if some slot was requested but nothing was extracted
                # it will allow other policies to predict another action
                raise ActionExecutionRejection(self.name(),
                                               "Failed to validate slot {0} "
                                               "with action {1}"
                                               "".format(slot_to_fill,
                                                         self.name()))

        # we'll check when validation failed in order
        # to add appropriate utterances
    

        # validation succeed, set the slots values to the extracted values
        return [SlotSet(slot, value) for slot, value in slot_values.items()]

    def submit(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict]:

        """Define what the form has to do
            after all required slots are filled"""

        topic_news = tracker.get_slot("topic_news")
        
        pageSize = '2' # Set the number to how many news articles you want to fetch 
        
        url = "https://newsapi.org/v2/everything?q=" + topic_news + "&apiKey=" + NEWS_API_KEY + "&pageSize=" + pageSize
        
        r = requests.get(url = url)
        data = r.json() # extracting data in json format
        data = data['articles']

        dispatcher.utter_message("Here is some news I found!")

        for i in range(len(data)):
            output = data[i]['title'] + "\n" + data[i]['url'] + "\n"
            dispatcher.utter_message(output)

        dispatcher.utter_template("utter_confirm_if_service_is_correct", tracker)

        # utter submit template
        return []