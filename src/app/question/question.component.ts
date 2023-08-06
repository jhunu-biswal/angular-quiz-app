import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval, timeout } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent  implements OnInit{
  public name:string="";
  public questionList: any = [];
  public currentQuestion:number = 0;
  public points:number = 0;
  counter=60;
  correctAnswer:number = 0;
  inCorrectAnswer:number = 0;
  setInterval$:any;
  progress:string ="0";
  constructor(private questionService:QuestionService) {}

  ngOnInit(): void {
     this.name = localStorage.getItem("name")!; 
     this.getAllQuestions();
  }
  getAllQuestions() {
    this.questionService.getQuestinJson()
    .subscribe(res=>{
      console.log(res.questions);
      this.questionList =res.questions
    })
  }
  nextQuestion(){
    this.currentQuestion++;
  }
  previousQuestion(){
    this.currentQuestion--;
  }
  answer(currentQno:number,option:any){
    if(option.correct){
    this.points+= 10;
    this.correctAnswer++;
    // this.points = this.points + 10;
    setTimeout(()=>{
      this.currentQuestion++;
      this.resetCounter();
      this.getprogresspercent();
    },1000);
    
    }
    else{
      setTimeout(()=>{
        this.currentQuestion++;
      this.inCorrectAnswer++;
      this.resetCounter();
      this.getprogresspercent();
      },1000);
      this.points-=10;
      
    }
  }
  startCounter(){
    this.setInterval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=60;
        this.points-=10;
      }
    });
    setTimeout(()=>{
      this.setInterval$.unsubscribe();
    }, 600000);
  }
  stopCounter(){
this.setInterval$.unsubscribe();
this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
    this.progress="0";
  }
  getprogresspercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

}
