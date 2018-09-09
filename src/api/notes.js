const mongoose = require('mongoose');
const Router = require('koa-router');
const NotesModal = require('../schema/notesSchema');
const ReminerModel = require('../schema/reminderSchema');
const logger = require('../logger/logger').logger;

const router = Router({
    prefix: '/api'
});

router.get('/', async (ctx) => {
     const notes = await NotesModal.find({}).populate('reminder');
     ctx.body = notes;
     ctx.status = 200;
});

router.get('/:id', async (ctx) => {
    let id = ctx.params.id;
    const notes = await NotesModal.findOne({_id: id}).populate('reminder');
    console.log(notes);
    if (notes) { 
        ctx.body = notes;
        ctx.status = 200;
    } 
    else {
        ctx.body = {
            "message": "Item not found",
            "success": false
        }
        ctx.status = 200;
    }
});

router.put('/:id', async (ctx, next) => {
    let id = ctx.params.id;
    let bdy = ctx.request.body;
    console.log(ctx.request.body);
    const note = await NotesModal.findById(id);
    let newreminder; //New reimnder from request body
    let updatedReminder = null; //Updated reminder object 

    try {
        newreminder = bdy.reminder;
    }
    catch(err) {
        newreminder = null;
    }

    if (newreminder) { //if user want to update reminder 
        let reminderId // Id of reminder to update
        try {
             reminderId = note.reminder; //old reminder object
        } catch(err) {
            //checking for 'undefined' error
             reminderId = null;
        }

        if (reminderId) { //If there is already reminder 
            try {
                 updatedReminder = await ReminerModel.findByIdAndUpdate(reminderId, newreminder, {new: true});
            }
            catch(err) {
                ctx.status = err.statusCode || err.status || 500;
                ctx.body = err._message;
                ctx.app.emit('error', err, ctx);
                return;
            }
        }
        else { //else create new reminder 
            try {
                 updatedReminder = await new ReminerModel({
                                            assigntime: new Date(),
                                            completetime: newreminder.completetime,
                                            for: newreminder.for,
                                            status: newreminder.status||'pending'
                                        }).save();
            }
            catch(err) {
                console.log(err.statusCode);
                console.log(err.status);
                ctx.status = err.statusCode || err.status || 500;
                ctx.body = err._message;
                ctx.app.emit('error', err, ctx);
                return;
            }
        }
        try {
            let newBody = Object.assign({}, bdy);
            try {
                newBody.reminder = updatedReminder._id;
            } catch(err) {
                //Catch error for undefine _id
                //Catch error for undefine reminder 
            }
            let newNotes = await NotesModal.findByIdAndUpdate(id, newBody, {new: true});
            ctx.status = 200;
            newNotes.reminder = updatedReminder;
            ctx.body = {
                message: "Notes updated",
                note: newNotes,
                success: true
            }
          }
          catch(err) {
              ctx.status = err.statusCode || err.status || 500;
              ctx.body = err._message;
              ctx.app.emit('error', err, ctx);
          }
    }
    else { //User dont't want to update reminder 
        try {
            let newBody = Object.assign({}, bdy);
            let newNotes = await NotesModal.findByIdAndUpdate(id, newBody, {new: true});
            console.log(ctx.req.body);
            ctx.status = 200;
            ctx.body = {
                message: "Notes updated",
                success: true,
                note: newNotes
            }
        }
        catch(err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = err._message;
            ctx.app.emit('error', err, ctx);
        }
    }

});

router.del('/:id', async (ctx, next) => {
    let id = ctx.params.id;
    try {
        const note = await NotesModal.findById(id);
        let reminderId = null;
        try {
         reminderId = note.reminder;
        }
        catch(err) {}
        if (reminderId) {
            try {
                let output = await ReminerModel.findByIdAndRemove(reminderId);
            }
            catch(err) {
                console.log(err.statusCode);
                console.log(err.status);
                ctx.status = err.statusCode || err.status || 500;
                ctx.body = {
                    "success": false,
                    "message": err._message 
                };
                ctx.app.emit('error', err, ctx);
                return;
            }
        }
        try {
            let output = await NotesModal.findByIdAndRemove(id);
            console.log(output);
            if (output) {
                ctx.status = 200;
                ctx.body = {
                    success: true,
                    message: "Data deleted successfully"
                }
            }
            else {
                ctx.status = 500;
                ctx.body = {
                    success: false,
                    message: "Data no found!"
                }
            }
        }
        catch(err) {
            console.log(err.statusCode);
            console.log(err.status);
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                "success": false,
                "message": err._message 
            };
            ctx.app.emit('error', err, ctx);
            return;
        }
    }
    catch(err) {
        console.log(err.statusCode);
        console.log(err.status);
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            "message": err._message,
            "success": false 
        };
        ctx.app.emit('error', err, ctx);
        return;
    }
});

router.post('/', async (ctx, next) => {
    const bdy = ctx.request.body;
    let remindeObj = null;
    let newNote = null; 
    let reminder = null;
    let completetime = null;
    try {
        reminder = bdy.reminder;
    } catch(err) {
        //If no reminder is send
    }
    
    if (reminder) {
        try {
          if (reminder.completetime < new Date()) {
            ctx.status =  500;
            ctx.body = "Reminder date must be greather then date today";
            return;
          }
          remindeObj = await new ReminerModel({
                            assigntime: new Date(),
                            completetime: reminder.completetime,
                            for: bdy.reminder.for,
                            status: bdy.reminder.status||'pending'
                        }).save();
            console.log(remindeObj);
        } catch(err) {
            console.log(err.statusCode);
            console.log(err.status);
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = err._message;
            ctx.app.emit('error', err, ctx);
            return;
        }
    }

    try {
        newNote =  await new NotesModal({
                            time: new Date(),
                            title: bdy.title,
                            details: bdy.details,
                            reminder: remindeObj? remindeObj._id: null  //If reminder is there save it else don't save it  
                        }).save();
        console.log(newNote);
        ctx.status = 200;
        newNote.reminder = remindeObj;
        ctx.body = {
            success: true,
            note: newNote
        };
     } catch(err) {
        console.log(err.statusCode);
        console.log(err.status);
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = err._message;
        ctx.app.emit('error', err, ctx);
     }
});

module.exports = router.routes();