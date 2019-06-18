// Copyright 2019, University of Colorado Boulder

/**
 * Model for the Lab screen
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const CommonModel = require( 'VECTOR_ADDITION/common/model/CommonModel' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Vector2 = require( 'DOT/Vector2' );
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  const NUMBER_OF_SCENES = 1;
  const NUMBER_OF_VECTOR_SETS = 2;

  class LabModel extends CommonModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // TODO: should this be put into the constants file, it is the same size for 1D 2D and lab
      const graphDimension = new Dimension2( 60, 40 );
      const graphUpperLeftPosition = new Vector2( -5, 35 );

      super( graphDimension, graphUpperLeftPosition, NUMBER_OF_SCENES, NUMBER_OF_VECTOR_SETS, tandem );

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


      // Possible orientations for this screen, order of this array doesn't matter since the visibility is toggled
      const vectorTypes = [ VectorTypes.ONE, VectorTypes.TWO ];

      for ( let i = 0; i < numberOfScenes; i++ ) {

        const newScene = new Scene( graphDimension, graphUpperLeftPosition, NUMBER_OF_VECTOR_SETS, this.componentStyleProperty, _, {
          vectorTypes: vectorTypes
        } );

        this.scenes.push( newScene );
      }
    }

  }

  return vectorAddition.register( 'LabModel', LabModel );
} );