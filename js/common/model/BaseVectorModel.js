// Copyright 2019, University of Colorado Boulder

/**
 * Base class for vector models for all types of vectors (sum, component, etc.). 
 * Primarily responsibilities are:
 * 
 * - tip and tail position
 * - 'attributes property' (x and y, or in other words the actual vector <x, y>)
 * - label
 * - update of tail and tip position when the origin is dragged (modelViewTransformProperty is changed)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class BaseVectorModel {
    /**
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} xMagnitude horizontal component of the vector
     * @param {number} yMagnitude vertical component of the vector
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {string} label
     */
    constructor( tailPosition, xMagnitude, yMagnitude, modelViewTransformProperty, label ) {

      // Type check arguments
      assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
      assert && assert( typeof xMagnitude === 'number', `invalid xMagnitude: ${xMagnitude}` );
      assert && assert( typeof yMagnitude === 'number', `invalid yMagnitude: ${yMagnitude}` );
      assert && assert( modelViewTransformProperty instanceof DerivedProperty 
        && modelViewTransformProperty.value instanceof ModelViewTransform2, 
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( typeof label === 'string', `invalid label: ${label}` );


      // @public (read-only) {string}
      this.label = label;

      // @public {Vector2Property} - The tail position of the vector on the graph.
      this.tailPositionProperty = new Vector2Property( tailPosition );

      // @public {Vector2Property} - (x and y, or in other words the actual vector <x, y>)
      this.attributesVectorProperty = new Vector2Property( new Vector2( xMagnitude, yMagnitude ) );

      // @public {DerivedProperty.<Vector2>} - the tip position of the vector
      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.attributesVectorProperty ],
        ( tailPosition, vector ) => tailPosition.plus( vector ) );

      // @public {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( attributesVector.getMagnitude() )
      );

      // function to update the position of the tail of the vector
      const updateTailPosition = ( newModelViewTransform, oldModelViewTransform ) => {
        const oldTailViewPosition = oldModelViewTransform.modelToViewPosition( this.tailPositionProperty.value );
        this.tailPositionProperty.set( newModelViewTransform.viewToModelPosition( oldTailViewPosition ) );
      };
      modelViewTransformProperty.lazyLink( updateTailPosition );

      // @private - unlink the modelViewTransform link
      this.unlinkModelViewTransformProperty = () => {
        modelViewTransformProperty.unlink( updateTailPosition );
      };
    }
    /**
     * Dispose of the vector
     * @public
     */
    dispose() {
      this.tailPositionProperty.dispose();
      this.attributesVectorProperty.dispose();
      this.tipPositionProperty.dispose();
      this.magnitudeProperty.dispose();
      this.unlinkModelViewTransformProperty();
    }
  }

  return vectorAddition.register( 'BaseVectorModel', BaseVectorModel );
} );