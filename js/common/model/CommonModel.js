// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @constructor
   */
  class CommonModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public {BooleanProperty}
      this.sumVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.gridVisibleProperty = new BooleanProperty( false );

      // @public {Property.<VectorOrientation>}
      this.vectorOrientationProperty = new Property( VectorOrientation.HORIZONTAL );

      // @public {ObservableArray.<Vector>}
      this.vectors = new ObservableArray();

      const vect1 = new Vector( new Vector2Property( new Vector2( 0, 0 ) ),
        new Vector2Property( new Vector2( 5, 0 ) ),
        new BooleanProperty( false ),
        new NumberProperty( 0 ) );

      const vect2 = new Vector( new Vector2Property( new Vector2( 0, 0 ) ),
        new Vector2Property( new Vector2( 5, 0 ) ),
        new BooleanProperty( false ),
        new NumberProperty( 0 ) );

      const vect3 = new Vector( new Vector2Property( new Vector2( 0, 0 ) ),
        new Vector2Property( new Vector2( 5, 0 ) ),
        new BooleanProperty( false ),
        new NumberProperty( 0 ) );

      this.vectors.addAll( [ vect1, vect2, vect3 ] );
    }

    // @public resets the model
    reset() {
      this.sumVisibleProperty.reset();
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
    }
  }

  return vectorAddition.register( 'CommonModel', CommonModel );
} );