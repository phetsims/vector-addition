// Copyright 2019, University of Colorado Boulder

/**
 * Shared screen view for all screens
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorAdditionScreenView extends ScreenView {

    /**
     * @param {VectorAdditionModel} vectorAdditionModel
     * @param {Tandem} tandem
     * @param {Object} [sceneNodeOptions]
     */
    constructor( vectorAdditionModel, tandem, sceneNodeOptions ) {

      super();

      // TODO: do we need an instance or is a constant sufficient
      this.sceneNodes = [];

      this.graphToSceneNode = {};
      vectorAdditionModel.graphs.forEach( ( graph ) => {
        
        // create a scene node and add it as a child
        const sceneNode = new SceneNode( graph,
          vectorAdditionModel.gridVisibleProperty,
          vectorAdditionModel.componentStyleProperty,
          vectorAdditionModel.angleVisibleProperty,
          vectorAdditionModel.valuesVisibleProperty, {
            inspectVectorPanelOptions: sceneNodeOptions
          } );
        this.addChild( sceneNode );

        this.graphToSceneNode[ graph ] = sceneNode;
        
        this.sceneNodes.push( sceneNode );
      } );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          vectorAdditionModel.reset();

          // loop through SceneNodes and reset each sceneNode
          this.sceneNodes.forEach( ( sceneNode ) =>
            sceneNode.reset()
          );

        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );
} )
;