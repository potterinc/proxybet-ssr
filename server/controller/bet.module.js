const { Bets, BettingSlip } = require('../model/betslip.model')


const viewBets = async (req, res) => {
  try {
    const betHistory = await Bets.find({ userID: req.bearer.payload._id },
      { stake: 1, betSlip: 1, betDate: 1 })

    // query betslip status
    const betStatus = BettingSlip.findOne({ _id: betHistory.gameSlip })
      .then(err => {
        if (err) return res.status(401).json({
          message: 'No bet record(s) found'
        })

        res.status(200).render('view-bets', {
          slipResult: betStatus.result,
          betHistory,
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

const placeBet = (req, res) => {
  try {
    const games = new Bets({
      userID: req.bearer.payload._id,
      stake: req.body.stake,
      gameSlip: req.body.gameSlip
    })

    games.save()
      .then(data => {
        res.status(201).json({
          status: true,
          message: "OK: Bet Placed!"
        })
      })
      .catch(err => {
        res.status(400).json({
          status: false,
          message: err.message
        })
      })
  } catch (e) {
    res.status(500).json({
      message: e.message
    })
  }
}

module.exports = {
  viewBets,
  placeBet
}