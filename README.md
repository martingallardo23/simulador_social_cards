Dynamic social tags for Election Simulator
-

This repo is an appendix of [martingallardo23/simulador_elecciones](https://github.com/martingallardo23/simulador_elecciones). 
It is used to dynamically create social cards for the simulator, displaying the predicted results when sharing on social media.

It takes four URL parameters:

- `winner:` The name of the predicted winner of the election
- `election:` either `first` or `second`, representing whether the election was resolved in the first or second round
- `loser:` The name of the runner-up, can be empty if the election was resolved in the first round
- `percentage:` The percentage of votes the winner got

Example:

```
https://vercel-og-nextjs-omega-six.vercel.app/api/simulador?winner=Schiaretti&round=first&loser=None&percentage=100
```

Produces:

![](https://vercel-og-nextjs-omega-six.vercel.app/api/simulador?winner=Schiaretti&round=first&loser=None&percentage=100)
