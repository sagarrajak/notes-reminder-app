process.env.NODE_ENV = 'testing';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const server = require('../server');

describe('routes: main', () => {
    describe('GET /', () => {
        it('should return json', (done) => { 
            chai.request(server)
            .get('/')
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                res.body.status.should.eql('success');
                res.body.message.should.eql('Hello, world')
                done();
            });
        });
    });
});
