import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFileComponent } from './add-file/add-file.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { TravelBotComponent } from './travel-bot.component';
import { ContentComponent } from './content/content.component';
import { AddContentComponent } from './add-content/add-content.component';
import { AiChatComponent } from './ai-chat/ai-chat.component';

const routes: Routes = [
  { path: '', component: TravelBotComponent,
    children:
[  { path: 'ask', component:  AskQuestionComponent},
  { path: 'files', component: AddFileComponent },
  { path: 'content', component: ContentComponent},
  { path: 'add', component: AddContentComponent},
  { path: 'generate', component: AiChatComponent},
  { path: '', redirectTo: 'ask', pathMatch: 'full' }

]
   },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelBotRoutingModule { }
