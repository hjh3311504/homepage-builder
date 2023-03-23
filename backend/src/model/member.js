const mysqlPool = require('../api/mysql');
const queryGenerator = require('../api/queryGenerator');
const moment = require('moment');

/**
 * @typedef {object} Member
 * @property {number} med_no
 * @property {string} med_email
 * @property {string | undefined} med_password
 * @property {string | undefined} med_salt
 * @property {string | undefined} med_member_name
 * @property {string | null} med_provider
 * @property {string | null} med_provided_id
 * @property {string | undefined} med_phone
 * @property {string | undefined} med_zipcode
 * @property {string | undefined} med_address1
 * @property {string | undefined} med_address2
 * @property {"Y" | "N"} med_receive_email
 * @property {"Y" | "N"} med_receive_sms
 * @property {string} med_register_datetime
 * @property {string} med_register_ip
 * @property {string} med_lastlogin_datetime
 * @property {string} med_lastlogin_ip
 * @property {string | undefined} med_admin_note
 * @property {string} med_cmm_regdate
 * @property {string} med_cmm_remote_ip
 * @property {string} med_cmm_update
 * @property {string | undefined} med_cmm_member_id
 * @property {string | undefined} med_cmm_admin_id
 */

exports.findOne = async (condition) => {
  const query = queryGenerator
    .select('fbf_member_data', '*')
    .where(condition).text;

  try {
    const result = await mysqlPool.query(query);

    /** @type {Member} */
    let targetData;
    targetData = result[0][0];

    return targetData;
  } catch (err) {
    console.log(err);
  }
};

/** @param {Member} insertData */
exports.insertOne = async (insertData) => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = queryGenerator.insert('fbf_member_data', {
    ...insertData,
    med_register_datetime: currentTime,
    med_lastlogin_datetime: currentTime,
    med_cmm_regdate: currentTime,
  }).text;

  try {
    const result = await mysqlPool.query(query);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.update = async (condition, updateData) => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const query = queryGenerator
    .update('fbf_member_data', {
      ...updateData,
      med_cmm_update: currentTime,
    })
    .where(condition).text;

  // console.log(query);
  try {
    const result = await mysqlPool.query(query);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
