// client/src/pages/LiturgyHistory.js
import React from "react";

export default function LiturgyHistory() {
  return (
    <section className="container stack-lg">
      <header className="card stack">
        <h1>Liturgy and History</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Learn the structure of the Mass, the rhythm of the liturgical year, rites, councils, and sacred symbols.
        </p>
      </header>

      <div className="grid grid-2">
        <Card title="Order of the Mass">
          <List items={[
            "Introductory Rites: entrance, greeting, penitential act, Gloria, collect",
            "Liturgy of the Word: readings, psalm, Gospel, homily, creed, intercessions",
            "Liturgy of the Eucharist: preparation of the gifts, Eucharistic Prayer, the Lord’s Prayer, sign of peace, Communion",
            "Concluding Rites: blessing and dismissal"
          ]} />
        </Card>

        <Card title="Liturgical Year">
          <List items={[
            "Advent: preparation for the Nativity",
            "Christmas Season",
            "Ordinary Time",
            "Lent: preparation for Easter",
            "Sacred Triduum",
            "Easter Season: fifty days of joy",
            "Ordinary Time resumes"
          ]} />
        </Card>

        <Card title="Rites">
          <List items={[
            "Marriage",
            "Funerals",
            "Ordinations",
            "Baptisms",
            "Confirmations",
            "Anointing of the Sick"
          ]} />
        </Card>

        <Card title="Ecumenical Councils Timeline">
          <table className="table">
            <thead>
              <tr>
                <th>Council</th>
                <th>Year</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Nicaea I</td><td>325</td><td>Nicene Creed</td></tr>
              <tr><td>Constantinople I</td><td>381</td><td>Creed expanded</td></tr>
              <tr><td>Ephesus</td><td>431</td><td>Theotokos affirmed</td></tr>
              <tr><td>Chalcedon</td><td>451</td><td>Two natures of Christ</td></tr>
              <tr><td>Lateran IV</td><td>1215</td><td>Transubstantiation taught</td></tr>
              <tr><td>Trent</td><td>1545–1563</td><td>Reform and doctrine</td></tr>
              <tr><td>Vatican I</td><td>1869–1870</td><td>Papal infallibility</td></tr>
              <tr><td>Vatican II</td><td>1962–1965</td><td>Renewal of the Church</td></tr>
            </tbody>
          </table>
        </Card>

        <Card title="Symbol Glossary">
          <List items={[
            "Chalice: the cup used at the altar",
            "Ciborium: vessel for the consecrated hosts",
            "Monstrance: vessel that displays the Eucharist",
            "Stole: vestment of ordained ministers",
            "Dove: symbol of the Holy Spirit"
          ]} />
        </Card>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <article className="card stack">
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  );
}

function List({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      {items.map((i, idx) => <li key={idx}>{i}</li>)}
    </ul>
  );
}
