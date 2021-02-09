const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test'
    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.length).toEqual(2)
})

test('Should not allow task deletion', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()

})

test('Should not create task with invalid description', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: ''
    })
    .expect(400)
})

test('Should not create task with invalid completed property', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Invalid Task',
      completed: "isCompleted"
    })
    .expect(400)
})

test('Should not update task with invalid description', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: ''
    })
    .expect(400)
})

test('Should not update task with invalid completed property', async () => {
  await request(app)
  .patch(`/tasks/${taskOne._id}`)
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    description: 'Invalid Task',
    completed: "isCompleted"
  })
  .expect(400)
})

test('Should delete user task', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body).not.toBeNull()
})

test('Should not delete task if unauthenticated', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
})

test('Should not update other users task', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      completed: true
    })
    .send()
    .expect(404)
})

test('Should fetch user task by id', async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.description).toEqual('First task')
})

test('Should not get user task by id if unauthenticated', async () => {
  await request(app)
  .get(`/tasks/${taskOne._id}`)
  .send()
  .expect(401)
})

test('Should not get other users task by id', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
})

test('Should get only completed tasks', async () => {
  const response = await request(app)
    .get('/tasks?completed=true')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.length).toEqual(1)
})

test('Should get only incomplete tasks', async () => {
  const response = await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.length).toEqual(1)
})

test('Should sort tasks by description', async () => {
  const response = await request(app)
    .get('/tasks?sortBy=description:asc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body[0].description).toEqual('First task')
  expect(response.body[1].description).toEqual('Second task')
})

test('Should sort tasks by completed', async () => {
  const response = await request(app)
    .get('/tasks?sortBy=completed:desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body[0].description).toEqual('Second task')
  expect(response.body[1].description).toEqual('First task')
})

test('Should sort tasks by createdAt', async () => {
  const response = await request(app)
    .get('/tasks?sortBy=createdAt:asc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body[0].description).toEqual('First task')
  expect(response.body[1].description).toEqual('Second task')
})

test('Should sort tasks by updatedAt', async () => {
  // update second task
  await request(app)
    .patch(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Update second task'
    })
    .expect(200)
  // get tasks
  const response = await request(app)
    .get('/tasks?sortBy=updatedAt:desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body[0].description).toEqual('Update second task')
  expect(response.body[1].description).toEqual('First task')
})

test('Should fetch page of tasks', async () => {
  const response = await request(app)
    .get('/tasks?limit=2&skip=1')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body[0].description).toEqual('Second task')
})
