const { Bets, BettingSlip } = require('../model/betslip.model')


const viewBets = async (req, res) => {
  try {
    const betHistory = await Bets.find({ userID: req.bearer.userID },
      { stake: 1, betSlip: 1, betDate: 1 })

      // query betslip status
    const betStatus = BettingSlip.findOne({ _id: betHistory.betSlip })
      .then((err, data) => {
        if (err) return res.sendStatus(401)

        res.status(200).render('view-bets', {
          slipResult: betStatus.result,
          betHistory
        })
      })
      .catch(e => {
        res.status(501).json({
          message: e.message
        })
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