const { Bets } = require('../model/betslip.model')


const viewBets = async (req, res) => {
  try {
    const betHistory = await Bets.find({ userID: req.bearer.userID })
    res.send(200).render('view-bets', {
      betHistory
    })
  } catch (e) {
    res.status(501).json({
      message: e.message
    })
  }
}


module.exports = {
  viewBets
}