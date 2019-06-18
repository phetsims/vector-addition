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
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

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

      this.vectorOrientationProperty.value = EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION;
      this.vectorType = VectorTypes.ONE;
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

      // create an object with the orientation as the key, and the scene as the value
      this.orientationToSceneObject = {};

      // Possible orientations for this screen, order of this array doesn't matter since the visibility is toggled
      const orientations = [ VectorOrientations.HORIZONTAL, VectorOrientations.VERTICAL ];

      for ( let i = 0; i < numberOfScenes; i++ ) {

        const newScene = new Scene( graphDimension, graphUpperLeftPosition, NUMBER_OF_VECTOR_SETS, this.componentStyleProperty, VectorTypes.ONE, {
          graphOptions: {
            orientation: orientations[ i ]
          }
        } );

        this.orientationToSceneObject[ orientations[ i ] ] = newScene;

        this.scenes.push( newScene );
      }
    }

    /**
     * Get the scene based on orientation
     * This is not an override, rather a method specific to explore1D
     * @public
     */
    getScene( orientation ) {
      const scene = this.orientationToSceneObject[ orientation ];
      assert && assert( scene, `${orientation} is not a valid orientation` );

      return scene;
    }

  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );