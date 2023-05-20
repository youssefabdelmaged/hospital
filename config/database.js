
const mongoose=require('mongoose');

const dbconection=()=>{
    mongoose.connect(process.env.url_x).then((conn)=>{
        console.log(`connect db ${process.env.url_x}`);
     }).catch((err)=>{
        console.log(`err ${err}`);
        process.exit(1);
     });
  
};

module.exports = dbconection;

