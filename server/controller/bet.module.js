const { Bets, BettingSlip } = require('../model/betslip.model')
const { Wallet } = require('../model/wallet.model')

// View all bets
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

        res.status(200).render('view.bets', {
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

// Place a bet
const placeBet = async (req, res) => {
  const games = new Bets({
    userID: req.bearer.payload._id,
    stake: parseInt(req.body.stake),
    gameSlip: req.body.gameSlip
  })

  try {
    const walletBalance = await Wallet.find({ userID: games.userID }, {
      balance: 1
    })
    if (games.stake > walletBalance.balance) {
      res.status(400).json({
        status: false,
        message: "ERROR: Insufficient funds",
      })
      return
    }
    else {
      let newBalance = games.stake
      res.status(201).json({
        status: true,
        message: "OK: Bet Placed!",
      })
    }
    /**
     * Get wallet balance
     * Check if user has sufficent balance to place bet?
     *  Substract stake from balance
     *  update new wallet balance
       * else:send 400 insufficent balance
       */

    games.save()
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

// Update Game slip
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

// Cancel a bet
const cancelBet = async (req, res) => {
  try {
    await Bets.findOneAndDelete({ _id: req.body._id })

    /**
     * Refund stake
     */

  } catch (e) {
    res.status(501).json({
      status: false,
      message: e.message
    })
  }
}

// Generate bet slip
const ticketSlip = async (req, res) => {
  try {
  const slip = new BettingSlip({
    game: [{
      HTeam: req.body.HTeam,
      ATeam: req.body.ATeam,
      betOption: req.body.betOptions,
      betOdds: req.body.odds,
      gameStatus: req.body.gameStatus,
      startTime: req.body.matchTime
    }],
    userStakeLimit: req.body.stakeLimit,
    maximumStake: req.body.maxStake,
    totalOdds: req.body.odds
  })
    await slip.save()
    .then(data =>{
      res.status(401).json({
        status: true,
        message: "Ticket Generated"
      })
    })
    .catch(err =>{
      res.status(500).json({
        status: false,
        message: err.message
      })
    })
  }
  catch (e) {

  }
}

module.exports = {
  viewBets,
  placeBet,
  updateGameSlip,
  cancelBet,
  ticketSlip
}