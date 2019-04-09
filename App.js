import React, { Fragment, Component } from 'react';
import Helmet from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';

//CSS Theme
const style = theme => ({
   layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
    boxdiv: {
    width: '75%%',
    margin: 'auto',
    padding: '15px',
   // border: '2px solid #3D868A',
    borderRadius: '5px'
},
    recipediv: {
    width: '75%',
    margin: 'auto',
    padding: '5px',
    border: '2px solid #000000',
    borderRadius: '5px'
},
});

//Map all recipe md files needed for import
const ImportRecipes = (p) => p.keys().map(p);
const markdownFiles = ImportRecipes(require.context('./recipes', false, /\.md$/))
  .sort()
  .reverse();
//const recipelist = Object.entries(markdownFiles).map(([id, value]) => ({id,value}));

class NewRecipes extends Component {
  state = {
    recipes: [],
  }
 
//Fetch all md files - ansynchronous loading
  async componentDidMount() {
    const recipes = await Promise.all(markdownFiles.map((file) => fetch(file).then((res) => res.text())))
      .catch((err) => console.error(err));

    this.setState((state) => ({ ...state, recipes }));
  }

  render() {
    /* eslint-disable react/no-array-index-key */
    const {recipes} = this.state;
    const {classes} = this.props;
	  
    return (
    <Fragment>
	<Helmet title="New Recipes" />
	<section className="recipes"></section>
	<div className="container">
	<section className="section">
	<div className={classes.boxdiv}>
        {
        recipes.map((recipe, idx) => (
          
	<div className="card" key={idx}>
	    <div className={classes.recipediv}>
	    <ReactMarkdown source={recipe} />
	    </div>
	</div>
        ))
        }
	</div>
	</section>
	</div>
    </Fragment>    
    );
    /* eslint-enable react/no-array-index-key */
  }
}
