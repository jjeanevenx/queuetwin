# QueueTwin

**Simule falhas em fluxos de mensageria antes de encontrá-las em produção.**

QueueTwin é um projeto open source para explorar arquiteturas assíncronas usando simulações reproduzíveis. No primeiro incremento, modela um fluxo conceitual tópico → fila → worker → DLQ com probabilidades configuráveis de falha e duplicação.

> **Importante:** a versão 0.1 não reproduz fielmente SNS, SQS ou Kafka e não acessa nenhum recurso AWS. Não deve ser usada como prova de confiabilidade de sistemas reais.

## Executar

Requer Node.js 20+ e npm, sem instalar pacotes externos:

```bash
npm run dev
```

Acesse `http://127.0.0.1:4173`.

```bash
npm run check
npm test
npm run smoke
```

## Já disponível

- Simulações determinísticas por `seed`.
- Configuração de mensagens, tentativas, falhas e duplicações.
- Métricas e rastreamento de eventos.
- Três cenários de exemplo e dashboard responsivo.
- API HTTP de desenvolvimento.

## Próximas etapas

Topologias editáveis, semântica específica de SQS Standard/FIFO, tempos de visibilidade, redrive, backpressure, idempotência, importação/exportação de cenários e integrações opcionais com .NET/AWS. Veja o [roadmap](docs/roadmap.md).

Para contribuir com Claude Code, Codex ou Copilot, consulte [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md) e [fluxo de desenvolvimento com IA](docs/ai/WORKFLOW.md).

Licença MIT. Documentação canônica e código em inglês.
