const request = require("supertest");
const app = require("./app");

describe("Test the root path", () => {
  test("It should response the GET method", (done) => {
    request(app)
      .get("/login")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

// describe('Test the addLike method', () => {
//   beforeAll(() => {
//     MongoDB.connect();
//   });
//   afterAll((done) => {
//     mongoDB.disconnect(done);
//   });
// })

// modeule.exports = {
//   mongoose,
//   connect: () => {
//     mongoose.Promise = Promise;
//     mongoose.connect(config.database[process.env.NODE_ENV]);
//   },
//   disconnect: done => {
//     mongoose.disconnect(done);
//   }
// };
