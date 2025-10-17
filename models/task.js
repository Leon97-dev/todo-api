import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // 누락 시 에러가 나옴
      maxLength: 30,
    },
    description: {
      type: String,
    },
    isComplete: {
      // 할 일이 완료됐는지 표시하는 필드, 반드시 존재해야 하며 값을 안 주면 기본으로 false 설정
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // Mongoose가 createdAt, updatedAt 자동으로 생성해주는 옵션
  }
);

const Task = mongoose.model('Task', TaskSchema);
/*
mongoose.model('Task', TaskSchema) >> 이 한 줄이 합쳐진 것.
1. 'Task' > MongoDB에 저장될 컬렉션 이름
2. TaskSchema > 그 컬렉션 안에서 쓸 데이터의 형태(스키마)
즉, 여기서 변수 Task는 우리가 앞으로 쓸 모델 객체 이름이다. (이름이 꼭 같을 필요는 없다!)
스키마(Schema) | 데이터의 설계도 | const TaskSchema = new mongoose.Schema({...})
모델(Model) | 실제 데이터 조작 도구 | const Task = mongoose.model('Task', TaskSchema)
컬렉션(Collection) | DB 안의 실제 테이블 | 'Task' → MongoDB에선 tasks로 저장됨
*/
export default Task;
