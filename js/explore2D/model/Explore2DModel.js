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
  const Vector2 = require( 'DOT/Vector2' );
  const Property = require( 'AXON/Property' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  const NUMBER_OF_SCENES = 1;
  const NUMBER_OF_VECTOR_SETS = 1;
  const DEFAULT_VECTOR_ORIENTATION = VectorAdditionConstants.DEFAULT_VECTOR_ORIENTATION;

  class Explore2DModel extends CommonModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // TODO: should this be put into the constants file, it is the same size for 1D 2D and lab
      const graphDimension = new Dimension2( 60, 40 );
      const graphUpperLeftPosition = new Vector2( -5, 35 );

      super( graphDimension, graphUpperLeftPosition, NUMBER_OF_SCENES, NUMBER_OF_VECTOR_SETS, tandem );

      // @public {EnumerationProperty.<VectorOrientations>}
      this.vectorOrientationProperty = new Property( DEFAULT_VECTOR_ORIENTATION );
    }

  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );