const legacyRedirects = [
	{ source: '/index.html', destination: '/designinhtmlcss/index.html#/' },
	{ source: '/admin.html', destination: '/designinhtmlcss/index.html#/admin' },
	{ source: '/bank.html', destination: '/designinhtmlcss/index.html#/lender' },
	{ source: '/card.html', destination: '/designinhtmlcss/index.html#/card' },
	{ source: '/hdfc.html', destination: '/designinhtmlcss/index.html#/lender/hdfc' },
	{ source: '/sbi.html', destination: '/designinhtmlcss/index.html#/lender/sbi' },
	{ source: '/bankn.html', destination: '/designinhtmlcss/index.html#/lender/bankn' },
	{ source: '/card-hdfc-regalia-gold.html', destination: '/designinhtmlcss/index.html#/card/hdfc-regalia-gold' },
	{ source: '/freedom-credit-card.html', destination: '/designinhtmlcss/index.html#/card/hdfc-freedom' },
	{ source: '/millennia-credit-card.html', destination: '/designinhtmlcss/index.html#/card/hdfc-millennia' },
	{ source: '/moneyback-plus-credit-card.html', destination: '/designinhtmlcss/index.html#/card/hdfc-moneyback-plus' },
	{ source: '/phonepe-hdfc-bank-ultimo-credit-card.html', destination: '/designinhtmlcss/index.html#/card/hdfc-phonepe-ultimo' },
	{ source: '/phonepe-hdfc-uno-credit-card.html', destination: '/designinhtmlcss/index.html#/card/hdfc-phonepe-uno' },
	{ source: '/sbi-card1.html', destination: '/designinhtmlcss/index.html#/card/sbi-card1' },
	{ source: '/sbi-card2.html', destination: '/designinhtmlcss/index.html#/card/sbi-card2' },
	{ source: '/sbi-card3.html', destination: '/designinhtmlcss/index.html#/card/sbi-card3' },
	{ source: '/sbi-card4.html', destination: '/designinhtmlcss/index.html#/card/sbi-card4' },
	{ source: '/sbi-card5.html', destination: '/designinhtmlcss/index.html#/card/sbi-card5' },
	{ source: '/bankn-card1.html', destination: '/designinhtmlcss/index.html#/card/bankn-card1' },
	{ source: '/bankn-card2.html', destination: '/designinhtmlcss/index.html#/card/bankn-card2' },
	{ source: '/bankn-card3.html', destination: '/designinhtmlcss/index.html#/card/bankn-card3' },
	{ source: '/bankn-card4.html', destination: '/designinhtmlcss/index.html#/card/bankn-card4' },
	{ source: '/bankn/card1', destination: '/designinhtmlcss/index.html#/card/bankn-card1' },
	{ source: '/bankn/card2', destination: '/designinhtmlcss/index.html#/card/bankn-card2' },
	{ source: '/bankn/card3', destination: '/designinhtmlcss/index.html#/card/bankn-card3' },
	{ source: '/bankn/card4', destination: '/designinhtmlcss/index.html#/card/bankn-card4' },
	{ source: '/sbi/card1', destination: '/designinhtmlcss/index.html#/card/sbi-card1' },
	{ source: '/sbi/card2', destination: '/designinhtmlcss/index.html#/card/sbi-card2' },
	{ source: '/sbi/card3', destination: '/designinhtmlcss/index.html#/card/sbi-card3' },
	{ source: '/sbi/card4', destination: '/designinhtmlcss/index.html#/card/sbi-card4' },
	{ source: '/sbi/card5', destination: '/designinhtmlcss/index.html#/card/sbi-card5' },
	{ source: '/fintech-landing-page', destination: '/designinhtmlcss/index.html#/' },
]

module.exports = {
	async redirects() {
		return legacyRedirects.map((entry) => ({
			...entry,
			permanent: false,
		}))
	},
}
