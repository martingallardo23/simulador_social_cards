Dynamic social tags for Election Simulator
-

This repo is an appendix of [martingallardo23/simulador_elecciones](https://github.com/martingallardo23/simulador_elecciones). 
It is used to dynamically create social cards for the simulator, displaying the predicted results when sharing on social media.

It takes four URL parameters:

- `winner:` the name of the predicted next president
- `election:` either `first` or `second`, representing whether the election was resolved in the first or second round
- `loser:` the name of the runner-up, can be empty if the election was decided in the first round
- `percentage:` the winner's percentage in the last election

For example:

```
https://vercel-og-nextjs-omega-six.vercel.app/api/simulador?winner=Schiaretti&round=first&loser=None&percentage=100
```

produces

![](https://vercel-og-nextjs-omega-six.vercel.app/api/simulador?winner=Schiaretti&round=first&loser=None&percentage=100)
