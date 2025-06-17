const { success, error } = require('../utils/response');

exports.getUser = async (req, res) => {
 try {
    const user = req.user;
    res.status(200).json(success({ data: user, message: 'User fetched successfully' }));
 } catch (error) {
    res.status(500).json(error({ errors: error.message, message: 'An error occurred' }));
 }
};