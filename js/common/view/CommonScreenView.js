// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorDisplayPanel = require( 'VECTOR_ADDITION/common/view/VectorDisplayPanel' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  class CommonScreenView extends ScreenView {

    /**
     * @param {CommonModel} commonModel
     * @param {Tandem} tandem
     */
    constructor( commonModel, tandem ) {

      super();

      const graphNode = new GraphNode( commonModel );

      this.addChild( graphNode );

      const vectorDisplayPanel = new VectorDisplayPanel( commonModel.vectors, commonModel );

      vectorDisplayPanel.left = 195;
      vectorDisplayPanel.top = 12;
      this.addChild( vectorDisplayPanel );

      // create a scenery node for the sum vector
      const vectorSumNode = new VectorNode( commonModel.vectorSum,
        commonModel.gridModelBounds,
        commonModel.componentStyleProperty,
        commonModel.angleVisibleProperty,
        commonModel.modelViewTransformProperty );


      // link the visibility of the Vector Sum node with the status of the checkbox
      commonModel.sumVisibleProperty.linkAttribute( vectorSumNode, 'visible' );

      this.addChild( vectorSumNode );


      const resetAllButton = new ResetAllButton( {
        listener: () => {
          commonModel.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );

      commonModel.vectors.addItemAddedListener( ( addedVector ) => {
        const vectorNode = new VectorNode(
          addedVector,
          commonModel.gridModelBounds,
          commonModel.componentStyleProperty,
          commonModel.angleVisibleProperty,
          commonModel.modelViewTransformProperty
        );
        this.addChild( vectorNode );

        // Add the removal listener in case this vector is removed from the model.
        const removalListener = removedVector => {
          if ( removedVector === addedVector ) {

            // remove its node from the view
            vectorNode.dispose();

            // remove this listener to avoid leaking memory
            commonModel.vectors.removeItemRemovedListener( removalListener );
          }
        };

        // link removalListener to the provided ObservableArray
        commonModel.vectors.addItemRemovedListener( removalListener );
      } );
    }
  }

  return vectorAddition.register( 'CommonScreenView', CommonScreenView );
} )
;