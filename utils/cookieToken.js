const generateCookieToken = (user, res) => {
	//generate JWT token
	const token = user.getJwtToken();

	//put it into cookie options
	const options = {
		expires: new Date(Date.now() + process.env.COOKIE_EXPIARY_DAY * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	user.password = undefined;

	//send as cookie or as json body to support cross platform
	res.status(201).cookie("token", token, options).json({
		succes: true,
		token,
		user,
	});
};

module.exports = generateCookieToken;
