'use strict';

/** @type {import('sequelize-cli').Migration} */

'use strict';

module.exports={

async up(queryInterface,Sequelize){

await queryInterface.changeColumn(

'bank_accounts',

'ledgerAccountNumber',

{

type:Sequelize.STRING,

allowNull:false,

unique:true

}

);

},

async down(queryInterface,Sequelize){

await queryInterface.changeColumn(

'bank_accounts',

'ledgerAccountNumber',

{

type:Sequelize.STRING,

allowNull:true,

unique:true

}

);

}

};
