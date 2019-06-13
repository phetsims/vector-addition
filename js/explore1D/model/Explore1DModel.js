// Copyright 2019, University of Colorado Boulder

/**
 * Model for the explore1D screen
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const Vector2 = require( 'DOT/Vector2' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );

  // constants
  const EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION = VectorAdditionConstants.EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION;
  const NUMBER_OF_SCENES = 2;
  const NUMBER_OF_VECTOR_SETS = 1;

  class Explore1DModel extends CommonModel {

    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // TODO: should this be put into the constants file, it is the same size for 1D 2D and lab
      const graphDimension = new Dimension2( 60, 40 );
      const graphUpperLeftPosition = new Vector2( -30, 20 );

      super( graphDimension, graphUpperLeftPosition, NUMBER_OF_SCENES, NUMBER_OF_VECTOR_SETS, tandem );


      // @public {EnumerationProperty.<VectorOrientations>}
      this.vectorOrientationProperty = new Property( EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION );
    }
    
    /**
     * @override
     * Create the scenes
     * 1D scenes can have different vector orientations (horizontal and vertical)
     */
    createScenes(         
      graphDimension, 
      graphUpperLeftPosition, 
      numberOfScenes, 
      numberOfVectorSets ) {

      // @public {array.<Scene>} scenes - array of the scenes
      this.scenes = [];

      // Possible orientations for this screen, order of this array doesn't matter since the visibility is toggled
      const orientations = [ VectorOrientations.HORIZONTAL, VectorOrientations.VERTICAL ];

      for ( let i = 0; i < numberOfScenes; i++ ) {
        this.scenes.push( 
          new Scene( graphDimension, graphUpperLeftPosition, NUMBER_OF_VECTOR_SETS, {
            orientation: orientations[ i ] 
          } ) 
        );
      }
    }
    /**
     * Get the scene based on orientation
     * This is not an override, rather a method specific to explore1D
     * @public
     */
    getScene( orientation ) {
      for ( let i = 0; i < this.scenes.length; i ++ ) {
        if ( this.scenes[ i ].graph.orientation === orientation ) {
          return this.scenes[ i ];
        }
      }
      throw new Error( `${ orientation } is not a scene of 1d` );
    }

  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );