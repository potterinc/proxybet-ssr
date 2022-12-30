const { Bets, BettingSlip } = require('../model/betslip.model')
const {Wallet} = require('../model/wallet.model')


const viewBets = async (req, res) => {
  try {
    const betHistory = await Bets.find({ userID: req.bearer.payload._id },
      { stake: 1, betSlip: 1, betDate: 1, gameSlip: 1 })

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
        /**
         * Get wallet balance
         * Check if user has sufficent balance to place bet?
         *  Substract stake from balance
         *  update new wallet balance
         * else:send 400 insufficent balance
         */

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

const updateGameSlip = async (req, res) => {
  try {
    const previousGameSlip = await Bets.find({ _id: req.body._id });
    const previousStake = previousGameSlip.stake;
    const currentStake = parseInt(req.body.stake);

    const balanceStake = currentStake - previousStake
    /**
     * Get wallet balance
     * check if user has sufficinet funds?
     *   Wallet balance + balanceStake
     *   update wallet balance
     *  else: send 401 status code: Insufficient balance
     */

  }
  catch (e) {
    res.status(501).json({
      status: false,
      message: e.message
    })
  }
}

const cancelBet = async (req, res) => {
  try {
    await Bets.findOneAndDelete({_id: req.body._id})
    
  } catch (e) {
    res.status(501).json({
      status: false,
      message: e.message
    })
  }
}

module.exports = {
  viewBets,
  placeBet,
  updateGameSlip,
  cancelBet
}