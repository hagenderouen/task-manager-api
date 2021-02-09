const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Hagen',
    email: 'hagen@example.com',
    password: 'MyPass777'
  }).expect(201)

  // Assert that the db created the user correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Hagen',
      email: 'hagen@example.com'
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('MyPass777')
})

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  // Assert token in response matches users second token
  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
  await request(app).post('/users/login').send({
    email: 'nouser@mail.com',
    password: 'noPass123!!!'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  // Assert user was deleted from db
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Mike Jones'
    })
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.name).toBe('Mike Jones')
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Longview'
    })
    .expect(400)
})

test('Should not signup user with invalid email', async () => {
  await request(app)
  .post('/users')
  .send({
    name: 'Chris',
    email: 'bademailaddress',
    password: 'randoPass123#'
  })
  .expect(400)
})

test('Should not singup user with invalid password', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Chris',
      email: 'chris@mail.com',
      password: 'Password123'
    })
    .expect(400)
})

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      name: 'New name'
    })
    .expect(401)
})

test('Should not update user with invalid email', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: 'invalidemail.com'
    })
    .expect(400)
})

test('Should not update user with invalid password', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      password: 'Password123!!'
    })
    .expect(400)
})

test('Should not delete user if unauthenticated', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
