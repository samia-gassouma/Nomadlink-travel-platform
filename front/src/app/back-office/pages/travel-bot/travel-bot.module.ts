import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelBotRoutingModule } from './travel-bot-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { QaResultComponent } from './qa-result/qa-result.component';
import { AddFileComponent } from './add-file/add-file.component';
import { RouterModule } from '@angular/router';
import { TravelBotComponent } from './travel-bot.component';
import { ContentComponent } from './content/content.component';
import { AddContentComponent } from './add-content/add-content.component';
import { AiChatComponent } from './ai-chat/ai-chat.component';


@NgModule({
  declarations: [AskQuestionComponent,QaResultComponent,AddFileComponent, TravelBotComponent, ContentComponent, AddContentComponent, AiChatComponent],
  imports: [
    CommonModule,
    TravelBotRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [TravelBotComponent]
})
export class TravelBotModule { }
