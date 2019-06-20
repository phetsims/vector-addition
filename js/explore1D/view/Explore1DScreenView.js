// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const Explore1DVectorCreatorPanels = require( 'VECTOR_ADDITION/explore1D/view/Explore1DVectorCreatorPanels' );
  const Explore1DGraphControlPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DGraphControlPanel' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );


  class Explore1DScreenView extends VectorAdditionScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      super( explore1DModel, tandem );

      // function to the sceneNode based on scene model
      const getSceneNode = ( sceneModel ) => {
        for ( let i = 0; i < explore1DModel.scenes.length; i++ ) {

          if ( this.sceneNodes[ i ].scene === sceneModel ) {
            return this.sceneNodes[ i ];
          }
        }
      };

      // convenience variables for the scenes and the scene nodes
      const horizontalScene = explore1DModel.horizontalScene;
      const verticalScene = explore1DModel.verticalScene;

      const horizontalSceneNode = getSceneNode( horizontalScene );
      const verticalSceneNode = getSceneNode( verticalScene );


      // create the creator panel for each scene
      const explore1DVectorCreatorPanels = new Explore1DVectorCreatorPanels(
        horizontalScene.vectorSet, //TODO: find a better way than index 0, we can index 0 right now since there is only 1 vector set per scene for 1d
        horizontalScene.graph.modelViewTransformProperty,
        verticalScene.vectorSet,
        verticalScene.graph.modelViewTransformProperty );

      // create the vector panels
      const horizontalVectorCreatorPanel = explore1DVectorCreatorPanels.horizontalVectorCreatorPanel;
      const verticalVectorCreatorPanel = explore1DVectorCreatorPanels.verticalVectorCreatorPanel;


      explore1DModel.vectorOrientationProperty.link( ( vectorOrientation ) => {
        switch( vectorOrientation ) {
          case VectorOrientations.HORIZONTAL:
            verticalSceneNode.visible = false;
            verticalVectorCreatorPanel.visible = false;
            horizontalSceneNode.visible = true;
            horizontalVectorCreatorPanel.visible = true;
            break;
          case VectorOrientations.VERTICAL:
            verticalSceneNode.visible = true;
            verticalVectorCreatorPanel.visible = true;
            horizontalVectorCreatorPanel.visible = false;
            horizontalSceneNode.visible = false;
            break;
          case VectorOrientations.TWO_DIMENSIONAL:
            throw new Error( `Explore1D does not support vector orientation: ${vectorOrientation}` );
          default:
            console.log( vectorOrientation );
            throw new Error( `Vector orientation not handled: ${vectorOrientation}` );
        }
      } );

      const explore1DGraphControlPanel = new Explore1DGraphControlPanel(
        explore1DModel.sumVisibleProperty,
        explore1DModel.valuesVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.vectorType, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      const ArrowNodeOptions = { fill: 'black', doubleHead: true, tailWidth: 3, headWidth: 8, headHeight: 10 };
      // Scene radio buttons
      const sceneRadioButtonContent = [ {
        value: VectorOrientations.HORIZONTAL,
        node: new ArrowNode( 0, 0, 40, 0, ArrowNodeOptions )
      }, {
        value: VectorOrientations.VERTICAL,
        node: new ArrowNode( 0, 0, 0, 40, ArrowNodeOptions )
      } ];

      const sceneRadioButtonGroup = new RadioButtonGroup( explore1DModel.vectorOrientationProperty, sceneRadioButtonContent, {
        baseColor: 'white',
        selectedStroke: '#419ac9',
        selectedLineWidth: 2,
        right: this.layoutBounds.maxX - 4,
        top: explore1DGraphControlPanel.bottom + 10,
        orientation: 'horizontal'
      } );

      this.addChild( horizontalVectorCreatorPanel );
      this.addChild( verticalVectorCreatorPanel );
      this.addChild( explore1DGraphControlPanel );
      this.addChild( sceneRadioButtonGroup );

    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );