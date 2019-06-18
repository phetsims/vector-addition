// Copyright 2019, University of Colorado Boulder

/**
 * Base class for vector views for all types of vectors (sum, component, etc.).
 * Primarily responsibilities are:
 *  - Create an Arrow Node that mirrors a vector models tail/tip position
 *  - Create Other Nodes that ALL vectors in the sim have (ie. labels etc.)
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Multilink = require( 'AXON/Multilink' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class BaseVectorNode extends Node {
    /**
     * @constructor
     * @param {BaseVectorModel} vectorModel - the vector model
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     * @param {Object} arrowOptions - options passed to the arrow node for specific / specialized styling
     */
    constructor( vectorModel, modelViewTransformProperty, arrowOptions ) {

      // Type check arguments
      assert && assert( vectorModel instanceof BaseVectorModel, `invalid vectorModel: ${vectorModel}` );
      assert && assert( modelViewTransformProperty instanceof DerivedProperty
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( typeof arrowOptions === 'object', `invalid arrowOptions: ${arrowOptions}` );

      //----------------------------------------------------------------------------------------

      super();

      // Define a vector node in which the tail location (view coordinates) 
      // is (0, 0). Get the tip location in view coordinates
      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( vectorModel.components );

      // @public (read-only) {Node} arrowNode - Create an arrow node that represents an actual vector.
      this.arrowNode = new ArrowNode( 0, 0, tipDeltaLocation.x, tipDeltaLocation.y, arrowOptions );

      // @public (read-only) {Node} labelNode - Create a label for the vector that is displayed 'next' to the arrow. 
      // The location of this depends on the angle of the vector.
      this.labelNode = new FormulaNode( `\\vec{ ${vectorModel.label} \}` );

      this.setChildren( [ this.arrowNode, this.labelNode ] );

      //----------------------------------------------------------------------------------------
      // update the tail/tip location when the vector's tail/tip position changes

      // @public {Multilink} - observe changes to the tail/tip
      this.vectorObserver = new Multilink(
        [ vectorModel.tailPositionProperty, vectorModel.tipPositionProperty ],
        () => { this.updateVector( vectorModel, modelViewTransformProperty.value ); } );

    }

    /**
     * Update the tail and tip position of the view
     * @param {BaseVectorModel} vectorModel
     * @param {ModelViewTransform2} modelViewTransform
     * @public
     */
    updateVector( vectorModel, modelViewTransform ) {

      // Since the tail is defined at (0, 0) for the vector, we must translate.
      this.translation = modelViewTransform.modelToViewPosition( vectorModel.tail );

      // Get the tip location in view coordinates
      const tipDeltaLocation = modelViewTransform.modelToViewDelta( vectorModel.components );
      this.arrowNode.setTip( tipDeltaLocation.x, tipDeltaLocation.y );
    }

    /**
     * Dispose the vector
     * @public
     * @override
     */
    dispose() {
      this.arrowNode.dispose();
      this.labelNode.dispose();
      this.vectorObserver.dispose();
      super.dispose();
    }
  }

  return vectorAddition.register( 'BaseVectorNode', BaseVectorNode );
} );