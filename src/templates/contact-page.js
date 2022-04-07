/** @jsx jsx */
import { jsx } from "theme-ui"
import { graphql } from "gatsby"

import { MdEmail } from "react-icons/md"
import { ImPhone, ImLocation } from "react-icons/im"

import Layout from "../components/layout"
import Seo from "../components/seo"

export const pageQuery = graphql`
  query ContactQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 140)
      frontmatter {
        title
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`

const Contact = ({ data }) => {
  const { markdownRemark, site } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  return (
    <Layout className="contact-page" sx={contactStyles.contactPage}>
      <Seo
        title={frontmatter.title}
        description={frontmatter.title + " " + site.siteMetadata.title}
      />
      <div className="wrapper">
        <h1>{frontmatter.title}</h1>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div style={{display: "flex", alignItems: "center"}}>
          <span style={{fontSize: "40px"}}><MdEmail /></span> 
          <span style={{paddingBottom: "10px", paddingLeft: "1rem"}}>n-yuta[at]ids.osaka-u.ac.jp / nyuta1212[at]gmail.com</span>
        </div>
        <div style={{display: "flex", alignItems: "center"}}>
          <span style={{fontSize: "40px"}}><ImPhone /></span> 
          <span style={{paddingBottom: "10px", paddingLeft: "1rem"}}>06-6105-6070</span>
        </div>
        <div style={{display: "flex", alignItems: "center"}}>
          <span style={{fontSize: "40px"}}><ImLocation /></span> 
          <span style={{paddingBottom: "10px", paddingLeft: "1rem"}}>2-8 Technoalliance Building C503, Yamadaoka, Suita, Osaka 565-0872</span>
        </div>
      </div>
    </Layout>
  )
}

export default Contact

const contactStyles = {
  contactPage: {
    input: {
      border: "6px solid",
      borderColor: "inputBorder",
      bg: "inputBackground",
      outline: "none",
    },
    textarea: {
      border: "6px solid",
      borderColor: "inputBorder",
      bg: "inputBackground",
      outline: "none",
    },
  },
}
