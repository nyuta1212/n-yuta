/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { 
  toggleContainer, 
  toggle, 
  checked, 
  title, 
  authors, 
  venue,
  btn,
  btnBlue 
} from "./publication-page.module.css"


export const pageQuery = graphql`
  query PublicationQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 140)
      frontmatter {
        title
      }
    }
    allReference {
      edges {
        node {
          key
          title
          author
          authors
          year
          date
          entry_type
          raw
        }
      }
    }
  }
`


const RenderItems = items => {
  return items.map((_item,_key) => {
    const links = [];
    if (_item.url) {
      links.push((<a className={`${btn} ${btnBlue}`} href={_item.url} target="_blank" rel="noreferrer">URL</a>));
    }
    if (_item.arxiv) {
      links.push((<a className={`${btn} ${btnBlue}`} href={_item.arxiv} target="_blank" rel="noreferrer">ArXiv</a>));
    }
    if (_item.website) {
      links.push((<a className={`${btn} ${btnBlue}`} href={_item.website} target="_blank" rel="noreferrer">Website</a>));
    }

    return(
      <div>
        <p className={title}>{_item.title}</p>
        <p className={authors}>{_item.author}</p>  
        <p className={venue}>
          {_item.entry_type === 'article' ? (_item.journal + ', ') :
            _item.entry_type === 'inproceedings' ? (_item.booktitle + ', ') : 
              _item.note ? _item.note : ''}
          {_item.month} {_item.year}
        </p>
        { links} 
      </div>
    )
  })
}


const RenderItemsByYear = items => {
  const beg_year = 2006;
  const end_year = (new Date()).getFullYear();

  const to_render = [];
  for (let i = end_year; i >= beg_year; i--) {
    const yearly = items.filter((e => {
      return (e.year == i);
    }));
    if (yearly.length > 0) {
      to_render.push((
        <div>
          <h2>{i}</h2>
          { RenderItems(yearly) }
        </div>
      ));
    }
  }
  return to_render;
}

const RenderItemsByType = items => {
  const types = ['article', 'inproceedings', 'book', 'misc'];
  const display_types = {
    'article': 'Journal',
    'inproceedings': 'Conference',
    'book': 'Book',
    'misc': 'Misc'

  };

  const to_render = [];
  for (let k in types) {
    const typely = items.filter((e => {
      return (e.entry_type === types[k]);
    }));
    if (typely.length > 0) {
      to_render.push((
        <div>
          <h2>{display_types[types[k]]}</h2>
          { RenderItems(typely) }
        </div>
      ));
    }
  }
  return to_render;
}


class PublicationRenderer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {isChecked: false};
    this.handleClick = this.handleClick.bind(this);
    this.dict = props.data;
  }

  handleClick () {
    this.setState({isChecked: !this.state.isChecked});
  }

  render(){
    return (
      <div>
        <div className={toggleContainer}>By type
          <div className={`${toggle} ${this.state.isChecked ? checked : ''}`} onClick={this.handleClick}></div>
        </div>
        { this.state.isChecked ? RenderItemsByType(this.dict) : RenderItemsByYear(this.dict) }
      </div>
    )
  }
}

  
const PublicationPage = ({ data }) => {
  const { allReference, markdownRemark } = data
  const { frontmatter, html, excerpt } = markdownRemark

  const dict = allReference.edges.map((_item, _key) => {
    const n2mon = ['', 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Set.', 'Oct.', 'Nov.', 'Dec.', ''];
    const booktitle =  _item.node.raw.match(/booktitle\s*=\s*["{]\s*(.+)\s*["}],?\s/i);
    const journal =  _item.node.raw.match(/journal\s*=\s*["{]\s*(.+)\s*["}],?\s/i);
    const month = _item.node.raw.match(/month\s*=\s*(\d+),?\s/i);
    const year =  _item.node.raw.match(/year\s*=\s*["{]\s*(\d+)\s*["}],?\s/i);
    const url =  _item.node.raw.match(/url\s*=\s*["{]\s*(.+)\s*["}],?\s/i);
    const arxiv =  _item.node.raw.match(/arxiv\s*=\s*["{]\s*(.+)\s*["}],?\s/i);
    const website =  _item.node.raw.match(/website\s*=\s*["{]\s*(.+)\s*["}],?\s/i);
    const note =  _item.node.raw.match(/note\s*=\s*["{]\s*(.+)\s*["}],?\s/i);

    let ym;
    let m;

    if (month) {
      m = month[1];
    } else {
      m = 13
    }
    ym = year[1] + ('00' + m).slice(-2);
    m = n2mon[Number(m)];

    let n = _item.node;
    n['date_key'] = ym;
    n['month'] = m;
    n['author'] = n.authors.join(', ').replaceAll('\\underline', '').replaceAll('~', ' ');
    if (journal) {
      n['journal'] = journal[1].replace('~', ' ');
    }
    if (booktitle) {
      n['booktitle'] = booktitle[1].replace('~', ' ');
    }
    if (note) {
      n['note'] = note[1].replaceAll('~', ' ').replaceAll('--', '-');
    }
    if (url) {
      n['url'] = url[1];
    }
    if (arxiv) {
      n['arxiv'] = arxiv[1];
    }
    if (website) {
      n['website'] = website[1];
    }
    
    return n;
  }).sort((a, b) => b.date_key - a.date_key)

  return (
    <Layout className="page">
      <Seo title={frontmatter.title} description={excerpt} />
      <div className="wrapper">
        <h1>{frontmatter.title}</h1>
        <PublicationRenderer data={dict}/>
      </div>
    </Layout>
  )
}

export default PublicationPage