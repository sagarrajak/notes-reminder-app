process.env.NODE_ENV = 'testing';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const testData = require('./notes.json');
chai.use(chaiHttp);

const server = require('../server');

describe('routes: main', () => {

    describe('POST /', () => {
        it('should save add new note to server', (done) => { 
            chai.request(server)
            .post('/api/')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(testData['note3'])
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                console.log(res.body);
                done();
            });
        });
    });


    describe('PUT/ ', () => {
            let id = null ; //varibale to store id of request object

            before((done) => {
                chai.request(server)
                .post('/api/') 
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(testData['note1'])
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200)
                    res.type.should.eql('application/json');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('note');
                    expect(res.body.note.title).eql(testData['note1'].title);
                    expect(res.body.note.details).eql(testData['note1'].details);
                    id = res.body.note._id;
                    done();
                });
            });

            it('should change title and details of notes', (done) => {
                let  data = testData['note2'];
                chai.request(server)
                    .put('/api/'+id)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(data)
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.eql(200);
                        res.type.should.eql('application/json');
                        res.body.should.have.property('message');
                        res.body.should.have.property('note');
                        res.body.note.should.have.property('title').eql(testData['note2'].title)
                        res.body.note.should.have.property('details').eql(testData['note2'].details)
                        console.log(res.body);
                        done();
                    });
            });

            it('should add reminder to the notes', (done) => {
                let data = testData['note4'];
                chai.request(server)
                    .put('/api/'+id)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(data)
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.eql(200);
                        res.type.should.eql('application/json');
                        res.body.should.have.property('message');
                        res.body.should.have.property('note');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('note');
                        res.body.note.should.have.property('reminder');
                        res.body.note.reminder.should.have.property('for').eql(data.reminder.for);
                        res.body.note.reminder.should.have.property('status').eql(data.reminder.status);
                        res.body.note.reminder.should.have.property('completetime');
                        console.log(res.body);
                        done();
                    });
            });

            it('should modify added reminder in notes', (done) => {
                let data = testData['note5'];
                chai.request(server)
                    .put('/api/'+id)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(data)
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.eql(200);
                        res.type.should.eql('application/json');
                        res.body.should.have.property('message');
                        res.body.should.have.property('note');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('note');
                        res.body.note.should.have.property('reminder');
                        res.body.note.reminder.should.have.property('for').eql(data.reminder.for);
                        res.body.note.reminder.should.have.property('status').eql(data.reminder.status);
                        res.body.note.reminder.should.have.property('completetime');
                        console.log(res.body);
                        done();
                    });
            });
    });


    describe('DEL /', () => {
        let id = null;

        before((done) => {
            chai.request(server)
            .post('/api/') 
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(testData['note7'])
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200)
                res.type.should.eql('application/json');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('note');
                expect(res.body.note.title).eql(testData['note7'].title);
                expect(res.body.note.details).eql(testData['note7'].details);
                id = res.body.note._id;
                done();
            });
        });

        it('it should delete item from cart', (done) => {
            chai.request(server)
                .delete('/api/'+id)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200)
                    res.type.should.eql('application/json');
                    res.body.should.have.property('success').eql('true');
                    res.body.should.have.property('message').eql('Data deleted successfully');
                    done();
                });
        });
    });
});
